import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { CreateRegisterDto } from '../dto/create-register.dto';

@Injectable()
export class CreateRegisterUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, outletId: string, userId: string, dto: CreateRegisterDto) {
        try {
            const register = await this.prisma.$transaction(async (tx) => {
                const newRegister = await tx.register.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
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
                        action: 'CREATE',
                        entity: 'Register',
                        entity_id: newRegister.register_id,
                        new_value: {
                            name: newRegister.name,
                            code: newRegister.code,
                        },
                    },
                });

                return newRegister;
            });

            return {
                success: true,
                message: 'Register created successfully',
                data: register,
            };
        } catch (error) {
            console.error('[CreateRegisterUseCase]: ', error);
            throw new InternalServerErrorException('Failed to create register');
        }
    }
}
