import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class DeleteUserUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, authorId: string, targetUserId: string) {
        try {
            // 1. Fetch target user
            const targetUser = await this.prisma.user.findFirst({
                where: { user_id: targetUserId, tenant_id: tenantId, deleted_at: null },
            });

            if (!targetUser) {
                throw new NotFoundException('User not found in your tenant');
            }

            // 2. Anti-Suicide: Cannot delete self
            if (authorId === targetUserId) {
                throw new ForbiddenException('Cannot delete your own account. Contact system administrator if needed.');
            }

            // 3. Security: Cannot delete OWNER via this endpoint
            if (targetUser.role === Role.OWNER) {
                throw new ForbiddenException('Cannot delete OWNER account via employee management');
            }

            const deletedUser = await this.prisma.$transaction(async (tx) => {
                const updated = await tx.user.update({
                    where: { user_id: targetUserId },
                    data: {
                        is_active: false,
                        deleted_at: new Date(),
                    },
                });

                // Audit Log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: updated.outlet_id,
                        user_id: authorId,
                        action: 'DELETE',
                        entity: 'User',
                        entity_id: targetUserId,
                        new_value: {
                            is_active: false,
                            deleted_at: updated.deleted_at,
                        },
                    },
                });

                return updated;
            });

            return {
                success: true,
                message: 'User account deactivated and deleted successfully (Soft Delete)',
                data: {
                    user_id: deletedUser.user_id,
                    name: deletedUser.name,
                },
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            console.error('[DeleteUserUseCase]: ', error);
            throw new InternalServerErrorException('Failed to delete user account');
        }
    }
}
