import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UpdateRegisterDto } from '../dto/update-register.dto';

@Injectable()
export class UpdateRegisterUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(
        tenantId: string,
        outletId: string,
        userId: string,
        registerId: string,
        dto: UpdateRegisterDto,
    ) {
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

            const register = await this.prisma.$transaction(async (tx) => {
                const updatedRegister = await tx.register.update({
                    where: { register_id: registerId },
                    data: {
                        name: dto.name,
                        code: dto.code,
                        is_active: dto.is_actvie,
                    },
                });

                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        user_id: userId,
                        action: 'UPDATE',
                        entity: 'Register',
                        entity_id: registerId,
                        old_value: {
                            name: existingRegister.name,
                            code: existingRegister.code,
                            is_active: existingRegister.is_active,
                        },
                        new_value: {
                            name: updatedRegister.name,
                            code: updatedRegister.code,
                            is_active: updatedRegister.is_active,
                        },
                    },
                });

                return updatedRegister;
            });

            return {
                success: true,
                message: 'Register updated successfully',
                data: register,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[UpdateRegisterUseCase]: ', error);
            throw new InternalServerErrorException('Failed to update register');
        }
    }
}
