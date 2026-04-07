import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UpdateProductIngredientDto } from '../dto/update-product-ingredient.dto';

@Injectable()
export class UpdateProductIngredientUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(
        tenantId: string,
        outletId: string,
        userId: string,
        ingredientId: string,
        dto: UpdateProductIngredientDto,
    ) {
        try {
            // Check ingredient exists
            const existingIngredient = await this.prisma.productIngredient.findFirst({
                where: {
                    ingredient_id: ingredientId,
                    tenant_id: tenantId,
                    outlet_id: outletId,
                    deleted_at: null,
                },
            });

            if (!existingIngredient) {
                throw new NotFoundException('Product ingredient not found');
            }

            // If updating product_id, verify product ownership
            if (dto.product_id) {
                const product = await this.prisma.product.findFirst({
                    where: {
                        product_id: dto.product_id,
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        deleted_at: null,
                    },
                });

                if (!product) {
                    throw new NotFoundException('Product not found');
                }
            }

            const ingredient = await this.prisma.$transaction(async (tx) => {
                const updatedIngredient = await tx.productIngredient.update({
                    where: { ingredient_id: ingredientId },
                    data: {
                        product_id: dto.product_id,
                        qty: dto.qty,
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
                        entity: 'Product Ingredient',
                        entity_id: ingredientId,
                        old_value: {
                            product_id: existingIngredient.product_id,
                            qty: existingIngredient.qty,
                        },
                        new_value: {
                            product_id: updatedIngredient.product_id,
                            qty: updatedIngredient.qty,
                        },
                    },
                });

                return updatedIngredient;
            });

            return {
                success: true,
                message: 'Product ingredient updated successfully',
                data: ingredient,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[UpdateProductIngredientUseCase]: ', error);
            throw new InternalServerErrorException('Failed to update product ingredient');
        }
    }
}
