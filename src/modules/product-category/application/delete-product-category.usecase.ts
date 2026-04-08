import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class DeleteProductCategoryUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, outletId: string, userId: string, productCategoryId: string) {
        try {
            const productCategory = await this.prisma.productCategory.findFirst({
                where: {
                    product_category_id: productCategoryId,
                    tenant_id: tenantId,
                    outlet_id: outletId,
                    deleted_at: null,
                },
            });

            if (!productCategory) {
                throw new NotFoundException(
                    'Product category not found or you don not have permission to delete it',
                );
            }

            const deletedProductCategory = await this.prisma.$transaction(async (tx) => {
                const updated = await tx.productCategory.update({
                    where: { product_category_id: productCategoryId },
                    data: {
                        deleted_at: new Date(),
                    },
                });

                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        user_id: userId,
                        action: 'DELETE',
                        entity: 'Product Category',
                        entity_id: productCategoryId,
                        new_value: {
                            deleted_at: updated.deleted_at,
                        },
                    },
                });

                return updated;
            });

            return {
                success: true,
                message: 'Product category deleted successfully',
                data: deletedProductCategory,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[DeletedProductCategoryUseCase]: ', error);
            throw new InternalServerErrorException('Failed to delete product category');
        }
    }
}
