import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class DeleteRegisterUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, outletId: string, userId: string, registerId: string) {
        try {
            const existingRegister = await this.prisma.register.findFirst({
                where: {
                    register_id: registerId,
                    tenant_id: tenantId,
                    outlet_id: outletId,
                    deleted_at: null,
                },
            });

            if (!existingRegister) {
                throw new NotFoundException('Register not found');
            }

            await this.prisma.$transaction(async (tx) => {
                await tx.register.update({
                    where: { register_id: registerId },
                    data: { deleted_at: new Date() },
                });

                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        user_id: userId,
                        action: 'DELETE',
                        entity: 'Register',
                        entity_id: registerId,
                    },
                });
            });

            return {
                success: true,
                message: 'Register deleted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[DeleteRegisterUseCase]: ', error);
            throw new InternalServerErrorException('Failed to delete register');
        }
    }
}
