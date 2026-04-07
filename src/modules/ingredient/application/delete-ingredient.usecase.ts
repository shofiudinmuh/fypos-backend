import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class DeleteIngredientUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(
        tenantId: string,
        outletId: string,
        userId: string,
        ingredientId: string,
    ) {
        try {
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

            await this.prisma.$transaction(async (tx) => {
                await tx.ingredient.update({
                    where: { ingredient_id: ingredientId },
                    data: { deleted_at: new Date() },
                });

                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        user_id: userId,
                        action: 'DELETE',
                        entity: 'Ingredient',
                        entity_id: ingredientId,
                    },
                });
            });

            return {
                success: true,
                message: 'Ingredient deleted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('[DeleteIngredientUseCase]: ', error);
            throw new InternalServerErrorException('Failed to delete ingredient');
        }
    }
}
