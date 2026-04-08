import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class GetProductVariantUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, outletId: string, variantId?: string, productId?: string) {
        try {
            if (variantId) {
                const variant = await this.prisma.productVariant.findFirst({
                    where: {
                        product_variant_id: variantId,
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        deleted_at: null,
                    },
                    include: {
                        products: true,
                    },
                });

                if (!variant) {
                    throw new NotFoundException('Product variant not found');
                }

                return {
                    success: true,
                    message: 'Product variant fetched successfully',
                    data: variant,
                };
            }

            const variants = await this.prisma.productVariant.findMany({
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
                message: 'Product variants fetched successfully',
                data: variants,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[GetProductVariantUseCase]: ', error);
            throw new InternalServerErrorException('Failed to fetch product variant(s)');
        }
    }
}
