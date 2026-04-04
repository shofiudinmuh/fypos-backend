import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResetPasswordUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(dto: ResetPasswordDto) {
        try {
            const tokenRecord = await this.prisma.passwordResetToken.findFirst({
                where: { token: dto.token },
                include: { users: true },
            });

            if (!tokenRecord) {
                throw new BadRequestException('Invalid or expired password reset token');
            }

            if (new Date() > tokenRecord.expires_at) {
                await this.prisma.passwordResetToken.delete({ where: { reset_token_id: tokenRecord.reset_token_id } });
                throw new BadRequestException('Invalid or expired password reset token');
            }

            const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);

            await this.prisma.$transaction(async (tx) => {
                // 1. Update Password
                await tx.user.update({
                    where: { user_id: tokenRecord.user_id },
                    data: { password_hash: newPasswordHash },
                });

                // 2. Clear Token
                await tx.passwordResetToken.delete({ where: { reset_token_id: tokenRecord.reset_token_id } });

                // 3. Audit Log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tokenRecord.users.tenant_id,
                        outlet_id: tokenRecord.users.outlet_id,
                        user_id: tokenRecord.user_id,
                        action: 'PASSWORD_RESET',
                        entity: 'User',
                        entity_id: tokenRecord.user_id,
                        new_value: { message: 'Password has been reset via token authentication' },
                    },
                });
            });

            return {
                success: true,
                message: 'Password has been set successfully. Please login with your new password.',
            };
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('[ResetPasswordUseCase]: ', error);
            throw new InternalServerErrorException('Failed to reset account password');
        }
    }
}
