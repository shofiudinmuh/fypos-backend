import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UpdateTenantProfileDto } from '../dto/update-tenant-profile.dto';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages.constants';

@Injectable()
export class UpdateTenantProfileUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, userId: string, dto: UpdateTenantProfileDto) {
        try {
            const tenant = await this.prisma.tenant.findUnique({
                where: { tenant_id: tenantId, deleted_at: null },
            });

            if (!tenant) {
                throw new NotFoundException(ERROR_MESSAGES.TENANT.NOT_FOUND);
            }

            // Retrieve user to get their active outlet_id for audit logging
            const user = await this.prisma.user.findUnique({
                where: { user_id: userId },
            });

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const updatedTenant = await this.prisma.$transaction(async (tx) => {
                const updated = await tx.tenant.update({
                    where: { tenant_id: tenantId },
                    data: {
                        name: dto.name,
                        phone: dto.phone,
                        address: dto.address,
                        business_type: dto.businessType,
                        updated_at: new Date(),
                    },
                });

                // Create Audit Log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: user.outlet_id,
                        user_id: userId,
                        action: 'UPDATE',
                        entity: 'Tenant',
                        entity_id: tenantId,
                        old_value: {
                            name: tenant.name,
                            phone: tenant.phone,
                            address: tenant.address,
                            business_type: tenant.business_type,
                        },
                        new_value: {
                            name: updated.name,
                            phone: updated.phone,
                            address: updated.address,
                            business_type: updated.business_type,
                        },
                    },
                });

                return updated;
            });

            return {
                success: true,
                message: 'Tenant profile updated successfully',
                data: updatedTenant,
            };
        } catch (error) {
            if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('[UpdateTenantProfileUseCase]: ', error);
            throw new InternalServerErrorException(ERROR_MESSAGES.TENANT.UPDATE_ERROR || 'Failed to update tenant profile');
        }
    }
}
