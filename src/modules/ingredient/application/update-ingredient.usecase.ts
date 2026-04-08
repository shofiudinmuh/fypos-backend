import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';

@Injectable()
export class UpdateIngredientUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(
        tenantId: string,
        outletId: string,
        userId: string,
        ingredientId: string,
        dto: UpdateIngredientDto,
    ) {
        try {
            // Check ingredient exists
            const existingIngredient = await this.prisma.ingredient.findFirst({
                where: {
                    ingredient_id: ingredientId,
                    tenant_id: tenantId,
                    outlet_id: outletId,
                    deleted_at: null,
                },
            });

            if (!existingIngredient) {
                throw new NotFoundException('Ingredient not found');
            }

            const ingredient = await this.prisma.$transaction(async (tx) => {
                const updatedIngredient = await tx.ingredient.update({
                    where: { ingredient_id: ingredientId },
                    data: {
                        ingredient_name: dto.ingredient_name,
                        unit: dto.unit,
                        minimum_stock: dto.minimum_stock,
                        updated_at: new Date(),
                    },
                });

                // Audit log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        user_id: userId,
                        action: 'UPDATE',
                        entity: 'Ingredient',
                        entity_id: ingredientId,
                        old_value: {
                            ingredient_name: existingIngredient.ingredient_name,
                            unit: existingIngredient.unit,
                            minimum_stock: existingIngredient.minimum_stock,
                        },
                        new_value: {
                            ingredient_name: updatedIngredient.ingredient_name,
                            unit: updatedIngredient.unit,
                            minimum_stock: updatedIngredient.minimum_stock,
                        },
                    },
                });

                return updatedIngredient;
            });

            return {
                success: true,
                message: 'Ingredient updated successfully',
                data: ingredient,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[UpdateIngredientUseCase]: ', error);
            throw new InternalServerErrorException('Failed to update ingredient');
        }
    }
}
