import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class DeleteProductUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, outletId: string, userId: string, productId: string) {
        try {
            // Check product exists
            const existingProduct = await this.prisma.product.findFirst({
                where: {
                    product_id: productId,
                    tenant_id: tenantId,
                    outlet_id: outletId,
                    deleted_at: null,
                },
            });

            if (!existingProduct) {
                throw new NotFoundException('Product not found');
            }

            await this.prisma.$transaction(async (tx) => {
                await tx.product.update({
                    where: { product_id: productId },
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
                        entity: 'Product',
                        entity_id: productId,
                        old_value: {
                            name: existingProduct.name,
                            price: existingProduct.price,
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
                message: 'Product deleted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[DeleteProductUseCase]: ', error);
            throw new InternalServerErrorException('Failed to delete product');
        }
    }
}
