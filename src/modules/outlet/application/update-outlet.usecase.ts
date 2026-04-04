import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UpdateOutletDto } from '../dto/update-outlet.dto';

@Injectable()
export class UpdateOutletUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, userId: string, outletId: string, dto: UpdateOutletDto) {
        try {
            const outlet = await this.prisma.outlet.findFirst({
                where: { outlet_id: outletId, tenant_id: tenantId, deleted_at: null },
            });

            if (!outlet) {
                throw new NotFoundException('Outlet not found or you do not have permission to update it');
            }

            const updatedOutlet = await this.prisma.$transaction(async (tx) => {
                const updated = await tx.outlet.update({
                    where: { outlet_id: outletId },
                    data: {
                        name: dto.name,
                        address: dto.address,
                        phone: dto.phone,
                        updated_at: new Date(),
                    },
                });

                // Audit Log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        user_id: userId,
                        action: 'UPDATE',
                        entity: 'Outlet',
                        entity_id: outletId,
                        old_value: {
                            name: outlet.name,
                            address: outlet.address,
                            phone: outlet.phone,
                        },
                        new_value: {
                            name: updated.name,
                            address: updated.address,
                            phone: updated.phone,
                        },
                    },
                });

                return updated;
            });

            return {
                success: true,
                message: 'Outlet updated successfully',
                data: updatedOutlet,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('[UpdateOutletUseCase]: ', error);
            throw new InternalServerErrorException('Failed to update outlet');
        }
    }
}
