import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class DeleteTenantUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, authorId: string) {
        try {
            const tenant = await this.prisma.tenant.findUnique({
                where: { tenant_id: tenantId, deleted_at: null },
            });

            if (!tenant) {
                throw new NotFoundException('Tenant not found');
            }

            // Fetch user for valid outlet_id to meet FK constraint
            const user = await this.prisma.user.findUnique({
                where: { user_id: authorId },
            });

            if (!user) {
                throw new InternalServerErrorException('Authorizing user not found');
            }

            const result = await this.prisma.$transaction(async (tx) => {
                // 1. Soft-Delete Tenant
                const updatedTenant = await tx.tenant.update({
                    where: { tenant_id: tenantId },
                    data: {
                        deleted_at: new Date(),
                    },
                });

                // 2. Deactivate all users of this tenant
                await tx.user.updateMany({
                    where: { tenant_id: tenantId, deleted_at: null },
                    data: {
                        is_active: false,
                        deleted_at: new Date(),
                    },
                });

                // 3. Audit Log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: user.outlet_id, // Global action but tied to owner's outlet
                        user_id: authorId,
                        action: 'DELETE',
                        entity: 'Tenant',
                        entity_id: tenantId,
                        new_value: {
                            message: 'Tenant account closed and all users deactivated',
                            deleted_at: updatedTenant.deleted_at,
                        },
                    },
                });

                return updatedTenant;
            });

            return {
                success: true,
                message: 'Tenant account and all associated users have been deactivated (Soft Delete)',
                data: {
                    tenant_id: result.tenant_id,
                    deleted_at: result.deleted_at,
                },
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('[DeleteTenantUseCase]: ', error);
            throw new InternalServerErrorException('Failed to close tenant account');
        }
    }
}
