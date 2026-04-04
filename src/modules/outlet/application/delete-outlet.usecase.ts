import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class DeleteOutletUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, userId: string, outletId: string) {
        try {
            const outlet = await this.prisma.outlet.findFirst({
                where: { outlet_id: outletId, tenant_id: tenantId, deleted_at: null },
            });

            if (!outlet) {
                throw new NotFoundException('Outlet not found or you do not have permission to delete it');
            }

            const deletedOutlet = await this.prisma.$transaction(async (tx) => {
                const updated = await tx.outlet.update({
                    where: { outlet_id: outletId },
                    data: {
                        deleted_at: new Date(),
                    },
                });

                // Audit Log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        user_id: userId,
                        action: 'DELETE',
                        entity: 'Outlet',
                        entity_id: outletId,
                        new_value: { deleted_at: updated.deleted_at },
                    },
                });

                return updated;
            });

            return {
                success: true,
                message: 'Outlet deleted successfully (Soft Delete)',
                data: deletedOutlet,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('[DeleteOutletUseCase]: ', error);
            throw new InternalServerErrorException('Failed to delete outlet');
        }
    }
}
