import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UpdateProductVariantDto } from '../dto/update-product-variant.dto';

@Injectable()
export class UpdateProductVariantUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(
        tenantId: string,
        outletId: string,
        userId: string,
        variantId: string,
        dto: UpdateProductVariantDto,
    ) {
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

            const variant = await this.prisma.$transaction(async (tx) => {
                const updatedVariant = await tx.productVariant.update({
                    where: { product_variant_id: variantId },
                    data: {
                        product_id: dto.product_id,
                        variant_name: dto.variant_name,
                        description: dto.description,
                        price: dto.price,
                        is_active: dto.is_active,
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
                        entity: 'Product Variant',
                        entity_id: variantId,
                        old_value: {
                            variant_name: existingVariant.variant_name,
                            price: existingVariant.price,
                            description: existingVariant.description,
                            product_id: existingVariant.product_id,
                        },
                        new_value: {
                            variant_name: updatedVariant.variant_name,
                            price: updatedVariant.price,
                            description: updatedVariant.description,
                            product_id: updatedVariant.product_id,
                        },
                    },
                });

                return updatedVariant;
            });

            return {
                success: true,
                message: 'Product variant updated successfully',
                data: variant,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[UpdateProductVariantUseCase]: ', error);
            throw new InternalServerErrorException('Failed to update product variant');
        }
    }
}
