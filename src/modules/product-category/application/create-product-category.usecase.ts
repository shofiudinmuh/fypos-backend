import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { CreateProductCategoryDto } from '../dto/create-product-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CreateProductCategoryUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(
        tenantId: string,
        outletId: string,
        userId: string,
        dto: CreateProductCategoryDto,
    ) {
        try {
            const productCategory = await this.prisma.$transaction(async (tx) => {
                const newProductCategory = await tx.productCategory.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        category_name: dto.category_name,
                        description: dto.description,
                    },
                });

                // Audit log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        user_id: userId,
                        action: 'CREATE',
                        entity: 'Product Category',
                        entity_id: newProductCategory.product_category_id,
                        new_value: {
                            category_name: newProductCategory.category_name,
                            description: newProductCategory.description,
                        },
                    },
                });

                return newProductCategory;
            });

            return {
                success: true,
                message: 'Product category created successfully',
                data: productCategory,
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Product category already exists');
                }
            }

            if (error instanceof ConflictException) {
                throw error;
            }

            console.error('[CreateProductCategoryUseCase]: ', error);
            throw new InternalServerErrorException('Failed to create product category');
        }
    }
}
