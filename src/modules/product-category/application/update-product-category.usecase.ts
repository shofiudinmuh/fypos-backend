import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UpdateProductCategoryDto } from '../dto/update-product-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UpdateProductCategoryUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(
        tenantId: string,
        outletId: string,
        userId: string,
        productCategoryId: string,
        dto: UpdateProductCategoryDto,
    ) {
        try {
            const productCategory = await this.prisma.productCategory.findFirst({
                where: { product_category_id: productCategoryId },
            });

            if (!productCategory) {
                throw new NotFoundException(
                    'Product category not found or you do not have permission to update it.',
                );
            }

            const updatedProductCategory = await this.prisma.$transaction(async (tx) => {
                const updated = await tx.productCategory.update({
                    where: { product_category_id: productCategoryId },
                    data: {
                        category_name: dto.category_name,
                        description: dto.description,
                        updated_at: new Date(),
                    },
                });

                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        user_id: userId,
                        action: 'UPDATE',
                        entity: 'Product Category',
                        entity_id: productCategoryId,
                        old_value: {
                            category_name: productCategory.category_name,
                            description: productCategory.description,
                        },
                        new_value: {
                            category_name: updated.category_name,
                            description: updated.description,
                        },
                    },
                });

                return updated;
            });

            return {
                success: true,
                message: 'Product category updated successfully',
                data: updatedProductCategory,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[UpdateProductCategoryUseCase]: ', error);
            throw new InternalServerErrorException('Failed to update product category');
        }
    }
}
