import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FileUploadService } from 'src/common/services/file-upload.service';

@Injectable()
export class UpdateProductUseCase {
    constructor(
        private prisma: PrismaService,
        private fileUploadService: FileUploadService
    ) {}

    async execute(
        tenantId: string,
        outletId: string,
        userId: string,
        productId: string,
        dto: UpdateProductDto,
        image?: Express.Multer.File
    ) {
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

            // If updating product_category_id, verify category ownership
            if (dto.product_category_id) {
                const category = await this.prisma.productCategory.findFirst({
                    where: {
                        product_category_id: dto.product_category_id,
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        deleted_at: null,
                    },
                });

                if (!category) {
                    throw new NotFoundException('Category not found');
                }
            }

            let imageUrl = dto.image_url !== undefined ? dto.image_url : existingProduct.image_url;
            if (image) {
                imageUrl = await this.fileUploadService.saveFile(image, 'products');
                // Optional: remove old file
                if (existingProduct.image_url && existingProduct.image_url.startsWith('/uploads/')) {
                    await this.fileUploadService.removeFile(existingProduct.image_url);
                }
            }

            const product = await this.prisma.$transaction(async (tx) => {
                const updatedProduct = await tx.product.update({
                    where: { product_id: productId },
                    data: {
                        product_category_id: dto.product_category_id,
                        name: dto.name,
                        sku: dto.sku,
                        description: dto.description,
                        price: dto.price !== undefined ? Number(dto.price) : existingProduct.price,
                        image_url: imageUrl,
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
                        entity: 'Product',
                        entity_id: productId,
                        old_value: {
                            name: existingProduct.name,
                            price: Number(existingProduct.price),
                            product_category_id: existingProduct.product_category_id,
                            image_url: existingProduct.image_url,
                        },
                        new_value: {
                            name: updatedProduct.name,
                            price: Number(updatedProduct.price),
                            product_category_id: updatedProduct.product_category_id,
                            image_url: updatedProduct.image_url,
                        },
                    },
                });

                return updatedProduct;
            });

            return {
                success: true,
                message: 'Product updated successfully',
                data: product,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[UpdateProductUseCase]: ', error);
            throw new InternalServerErrorException('Failed to update product');
        }
    }
}
