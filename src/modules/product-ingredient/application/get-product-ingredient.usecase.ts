import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class GetProductIngredientUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, outletId: string, ingredientId?: string, productId?: string) {
        try {
            if (ingredientId) {
                const ingredient = await this.prisma.productIngredient.findFirst({
                    where: {
                        ingredient_id: ingredientId,
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        deleted_at: null,
                    },
                    include: {
                        products: true,
                    },
                });

                if (!ingredient) {
                    throw new NotFoundException('Product ingredient not found');
                }

                return {
                    success: true,
                    message: 'Product ingredient fetched successfully',
                    data: ingredient,
                };
            }

            const ingredients = await this.prisma.productIngredient.findMany({
                where: {
                    tenant_id: tenantId,
                    outlet_id: outletId,
                    ...(productId ? { product_id: productId } : {}),
                    deleted_at: null,
                },
                include: {
                    products: true,
                },
            });

            return {
                success: true,
                message: 'Product ingredients fetched successfully',
                data: ingredients,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[GetProductIngredientUseCase]: ', error);
            throw new InternalServerErrorException('Failed to fetch product ingredient(s)');
        }
    }
}
