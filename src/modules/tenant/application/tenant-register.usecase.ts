import {
    Injectable,
    ConflictException,
    HttpException,
    InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TenantRegisterDto } from '../dto/tenant-register.dto';
import { addDays } from 'src/common/utils/date.utils';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages.constants';

@Injectable()
export class TenantRegisterUseCase {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async execute(dto: TenantRegisterDto) {
        try {
            const existingTenant = await this.prisma.tenant.findUnique({
                where: {
                    owner_email: dto.ownerEmail,
                    deleted_at: null,
                },
            });

            if (existingTenant) {
                throw new ConflictException(ERROR_MESSAGES.TENANT.ALREADY_REGISTERED);
            }

            const trialEndAt = addDays(new Date(), 30);
            const passwordHash = await bcrypt.hash(dto.password, 10);

            // Using transaction to ensure all operations succeed or fail together
            const result = await this.prisma.$transaction(async (tx) => {
                const tenant = await tx.tenant.create({
                    data: {
                        name: dto.name,
                        owner_email: dto.ownerEmail,
                        phone: dto.phone,
                        address: dto.address,
                        business_type: dto.businessType,
                        trial_end_at: trialEndAt,
                        subscription_status: 'trial',
                    },
                });

                // Create default outlet
                const outlet = await tx.outlet.create({
                    data: {
                        tenant_id: tenant.tenant_id,
                        name: 'Main Outlet',
                        address: dto.address || '',
                        phone: dto.phone || '',
                        outlet_code: `OUTLET-${tenant.tenant_id.substring(0, 8)}`,
                    },
                });

                // Create owner user linked to the new outlet
                const user = await tx.user.create({
                    data: {
                        tenant_id: tenant.tenant_id,
                        outlet_id: outlet.outlet_id,
                        name: dto.name,
                        email: dto.ownerEmail,
                        password_hash: passwordHash,
                        role: 'OWNER',
                        is_active: true,
                    },
                });

                // Create Audit Log for registration
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenant.tenant_id,
                        outlet_id: outlet.outlet_id,
                        user_id: user.user_id,
                        action: 'CREATE',
                        entity: 'Tenant',
                        entity_id: tenant.tenant_id,
                        new_value: { name: tenant.name, email: tenant.owner_email },
                    },
                });

                return { tenant, user };
            });

            const token = this.jwtService.sign({
                sub: result.user.user_id,
                tenant_id: result.tenant.tenant_id,
                role: result.user.role,
            });

            return {
                access_token: token,
                tenant_id: result.tenant.tenant_id,
                user: {
                    id: result.user.user_id,
                    name: result.user.name,
                    role: result.user.role,
                },
                isNewTenant: true,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('[TenantRegisterUseCase]: ', error);

            throw new InternalServerErrorException(ERROR_MESSAGES.TENANT.REGISTRATION_ERROR);
        }
    }
}
