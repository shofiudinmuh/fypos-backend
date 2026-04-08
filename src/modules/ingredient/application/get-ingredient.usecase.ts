import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class GetIngredientUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, outletId: string, ingredientId?: string) {
        try {
            if (ingredientId) {
                const ingredient = await this.prisma.ingredient.findFirst({
                    where: {
                        ingredient_id: ingredientId,
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        deleted_at: null,
                    },
                });

                if (!ingredient) {
                    throw new NotFoundException('Ingredient not found');
                }

                return {
                    success: true,
                    data: ingredient,
                };
            }

            const ingredients = await this.prisma.ingredient.findMany({
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
                count: ingredients.length,
                data: ingredients,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('[GetIngredientUseCase]: ', error);
            throw new InternalServerErrorException('Failed to fetch ingredient(s)');
        }
    }
}
