import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class GetRegisterUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, outletId: string, registerId?: string) {
        try {
            if (registerId) {
                const register = await this.prisma.register.findFirst({
                    where: {
                        register_id: registerId,
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        deleted_at: null,
                    },
                });

                if (!register) {
                    throw new NotFoundException('Register not found');
                }

                return {
                    success: true,
                    data: register,
                };
            }

            const registers = await this.prisma.register.findMany({
                where: {
                    tenant_id: tenantId,
                    outlet_id: outletId,
                    deleted_at: null,
                },
                orderBy: {
                    created_at: 'desc',
                },
            });

            return {
                success: true,
                count: registers.length,
                data: registers,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[GetRegisterUseCase]: ', error);
            throw new InternalServerErrorException('Failed to fetch registers');
        }
    }
}
