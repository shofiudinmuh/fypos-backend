import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { CreateProductVariantDto } from '../dto/create-product-variant.dto';

@Injectable()
export class CreateProductVariantUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(
        tenantId: string,
        outletId: string,
        userId: string,
        dto: CreateProductVariantDto,
    ) {
        try {
            // Verify product ownership
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

            const variant = await this.prisma.$transaction(async (tx) => {
                const newVariant = await tx.productVariant.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: outletId,
                        product_id: dto.product_id,
                        variant_name: dto.variant_name,
                        description: dto.description,
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
                        entity: 'Product Variant',
                        entity_id: newVariant.product_variant_id,
                        new_value: {
                            variant_name: newVariant.variant_name,
                            description: newVariant.description,
                            product_id: newVariant.product_id,
                        },
                    },
                });

                return newVariant;
            });

            return {
                success: true,
                message: 'Product variant created successfully',
                data: variant,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('[CreateProductVariantUseCase]: ', error);
            throw new InternalServerErrorException('Failed to create product variant');
        }
    }
}
