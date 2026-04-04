import {
    HttpException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages.constants';

@Injectable()
export class LoginUseCase {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async execute(dto: LoginDto) {
        try {
            if (!dto.email) {
                throw new UnauthorizedException(ERROR_MESSAGES.AUTH.EMAIL_REQUIRED);
            }

            const user = await this.prisma.user.findFirst({
                where: {
                    email: dto.email,
                    is_active: true,
                    deleted_at: null,
                },
            });

            if (dto.pin) {
                if (!user) {
                    throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS_PIN);
                }

                if (!user.pin) {
                    throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS_PIN);
                }

                const isPinMatch = await bcrypt.compare(dto.pin, user.pin);
                if (!isPinMatch) {
                    throw new UnauthorizedException(ERROR_MESSAGES.AUTH.WRONG_PIN);
                }
            } else if (dto.password) {
                if (!user) {
                    throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS_PASS);
                }

                if (!user.password_hash) {
                    throw new UnauthorizedException(ERROR_MESSAGES.AUTH.GOOGLE_ONLY);
                }

                const isPasswordMatch = await bcrypt.compare(dto.password, user.password_hash);
                if (!isPasswordMatch) {
                    throw new UnauthorizedException(ERROR_MESSAGES.AUTH.WRONG_PASSWORD);
                }
            } else {
                throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INPUT_REQUIRED);
            }

            const outletId = dto.outlet_id || user.outlet_id || null;

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 1); // 1 day session expiry

            await this.prisma.$transaction(async (tx) => {
                await tx.session.create({
                    data: {
                        user_id: user.user_id,
                        device_info: dto.device_info || 'Unknown Device',
                        expires_at: expiresAt,
                        is_active: true,
                    },
                });

                await tx.activityLog.create({
                    data: {
                        tenant_id: user.tenant_id,
                        outlet_id: outletId || '',
                        user_id: user.user_id,
                        action: 'USER_LOGIN',
                        payload: { email: user.email, role: user.role },
                    },
                });
            });

            const token = await this.jwtService.sign({
                sub: user.user_id,
                tenant_id: user.tenant_id,
                outlet_id: outletId,
                role: user.role,
            });

            return {
                success: true,
                access_token: token,
                tenant_id: user.tenant_id,
                outlet_id: outletId,
                user: {
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                message: `Login as ${user.role} successfully`,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new InternalServerErrorException(ERROR_MESSAGES.AUTH.LOGIN_ERROR);
        }
    }
}
