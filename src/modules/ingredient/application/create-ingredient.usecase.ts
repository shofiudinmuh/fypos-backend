import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';

@Injectable()
export class CreateIngredientUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, outletId: string, userId: string, dto: CreateIngredientDto) {
        try {
            const ingredient = await this.prisma.$transaction(async (tx) => {
                const newIngredient = await tx.ingredient.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        ingredient_name: dto.ingredient_name,
                        unit: dto.unit,
                        minimum_stock: dto.minimum_stock ?? 0,
                    },
                });

                // Audit log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        user_id: userId,
                        action: 'CREATE',
                        entity: 'Ingredient',
                        entity_id: newIngredient.ingredient_id,
                        new_value: {
                            ingredient_name: newIngredient.ingredient_name,
                            unit: newIngredient.unit,
                            minimum_stock: newIngredient.minimum_stock,
                        },
                    },
                });

                return newIngredient;
            });

            return {
                success: true,
                message: 'Ingredient created successfully',
                data: ingredient,
            };
        } catch (error) {
            console.error('[CreateIngredientUseCase]: ', error);
            throw new InternalServerErrorException('Failed to create ingredient');
        }
    }
}
