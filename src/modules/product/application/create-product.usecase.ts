import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { FileUploadService } from 'src/common/services/file-upload.service';

@Injectable()
export class CreateProductUseCase {
    constructor(
        private prisma: PrismaService,
        private fileUploadService: FileUploadService
    ) {}

    async execute(
        tenantId: string,
        outletId: string,
        userId: string,
        dto: CreateProductDto,
        image?: Express.Multer.File
    ) {
        try {
            // Verify product_category ownership
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

            let imageUrl = dto.image_url;
            if (image) {
                imageUrl = await this.fileUploadService.saveFile(image, 'products');
            }

            const product = await this.prisma.$transaction(async (tx) => {
                const newProduct = await tx.product.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        product_category_id: dto.product_category_id,
                        name: dto.name,
                        sku: dto.sku,
                        description: dto.description,
                        price: Number(dto.price),
                        image_url: imageUrl,
                        is_active: dto.is_active ?? true,
                    },
                });

                // Audit log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        user_id: userId,
                        action: 'CREATE',
                        entity: 'Product',
                        entity_id: newProduct.product_id,
                        new_value: {
                            name: newProduct.name,
                            price: Number(newProduct.price),
                            product_category_id: newProduct.product_category_id,
                            sku: newProduct.sku,
                            image_url: newProduct.image_url,
                        },
                    },
                });

                return newProduct;
            });

            return {
                success: true,
                message: 'Product created successfully',
                data: product,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[CreateProductUseCase]: ', error);
            throw new InternalServerErrorException('Failed to create product');
        }
    }
}
