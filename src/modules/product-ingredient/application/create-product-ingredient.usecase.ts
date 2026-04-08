import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { CreateProductIngredientDto } from '../dto/create-product-ingredient.dto';

@Injectable()
export class CreateProductIngredientUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(
        tenantId: string,
        outletId: string,
        userId: string,
        dto: CreateProductIngredientDto,
    ) {
        try {
            // Verify product ownership
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

            // Verify ingredient ownership
            const ingredientMaster = await this.prisma.ingredient.findFirst({
                where: {
                    ingredient_id: dto.ingredient_id,
                    tenant_id: tenantId,
                    outlet_id: outletId,
                    deleted_at: null,
                },
            });

            if (!ingredientMaster) {
                throw new NotFoundException('Ingredient not found');
            }

            const ingredient = await this.prisma.$transaction(async (tx) => {
                const newIngredient = await tx.productIngredient.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        product_id: dto.product_id,
                        ingredient_id: dto.ingredient_id,
                        qty: dto.qty,
                    },
                });

                // Audit log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        user_id: userId,
                        action: 'CREATE',
                        entity: 'Product Ingredient',
                        entity_id: newIngredient.product_ingredient_id,
                        new_value: {
                            product_id: newIngredient.product_id,
                            ingredient_id: newIngredient.ingredient_id,
                            qty: newIngredient.qty,
                        },
                    },
                });

                return newIngredient;
            });

            return {
                success: true,
                message: 'Product ingredient created successfully',
                data: ingredient,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[CreateProductIngredientUseCase]: ', error);
            throw new InternalServerErrorException('Failed to create product ingredient');
        }
    }
}
