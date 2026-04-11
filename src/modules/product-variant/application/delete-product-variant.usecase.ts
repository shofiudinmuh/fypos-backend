import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class DeleteProductVariantUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, outletId: string, userId: string, variantId: string) {
        try {
            // Check variant exists
            const existingVariant = await this.prisma.productVariant.findFirst({
                where: {
                    product_variant_id: variantId,
                    tenant_id: tenantId,
                    outlet_id: outletId,
                    deleted_at: null,
                },
            });

            if (!existingVariant) {
                throw new NotFoundException('Product variant not found');
            }

            await this.prisma.$transaction(async (tx) => {
                await tx.productVariant.update({
                    where: { product_variant_id: variantId },
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
                        entity: 'Product Variant',
                        entity_id: variantId,
                        old_value: {
                            variant_name: existingVariant.variant_name,
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
                message: 'Product variant deleted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[DeleteProductVariantUseCase]: ', error);
            throw new InternalServerErrorException('Failed to delete product variant');
        }
    }
}
