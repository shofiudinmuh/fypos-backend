import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class DeleteProductIngredientUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, outletId: string, userId: string, productIngredientId: string) {
        try {
            // Check ingredient exists
            const existingIngredient = await this.prisma.productIngredient.findFirst({
                where: {
                    product_ingredient_id: productIngredientId,
                    tenant_id: tenantId,
                    outlet_id: outletId,
                    deleted_at: null,
                },
            });

            if (!existingIngredient) {
                throw new NotFoundException('Product ingredient not found');
            }

            await this.prisma.$transaction(async (tx) => {
                await tx.productIngredient.update({
                    where: { product_ingredient_id: productIngredientId },
                    data: {
                        deleted_at: new Date(),
                    },
                });

                // Audit log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        user_id: userId,
                        action: 'DELETE',
                        entity: 'Product Ingredient',
                        entity_id: productIngredientId,
                        old_value: {
                            qty: existingIngredient.qty,
                            deleted_at: null,
                        },
                        new_value: {
                            deleted_at: new Date().toISOString(),
                        },
                    },
                });
            });

            return {
                success: true,
                message: 'Product ingredient deleted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[DeleteProductIngredientUseCase]: ', error);
            throw new InternalServerErrorException('Failed to delete product ingredient');
        }
    }
}
