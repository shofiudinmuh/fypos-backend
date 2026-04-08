import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class GetProductUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, outletId: string, productId?: string) {
        try {
            if (productId) {
                const product = await this.prisma.product.findFirst({
                    where: {
                        product_id: productId,
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        deleted_at: null,
                    },
                    include: {
                        productCategories: true,
                    },
                });

                if (!product) {
                    throw new NotFoundException('Product not found');
                }

                return {
                    success: true,
                    message: 'Product fetched successfully',
                    data: product,
                };
            }

            const products = await this.prisma.product.findMany({
                where: {
                    tenant_id: tenantId,
                    outlet_id: outletId,
                    deleted_at: null,
                },
                include: {
                    productCategories: true,
                },
            });

            return {
                success: true,
                message: 'Products fetched successfully',
                data: products,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[GetProductUseCase]: ', error);
            throw new InternalServerErrorException('Failed to fetch product(s)');
        }
    }
}
