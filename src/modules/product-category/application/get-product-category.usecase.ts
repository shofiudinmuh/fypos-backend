import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class GetProductCategoryUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, outletId: string) {
        try {
            const productCategories = await this.prisma.productCategory.findMany({
                where: {
                    tenant_id: tenantId,
                    outlet_id: outletId,
                    deleted_at: null,
                },
                orderBy: {
                    category_name: 'asc',
                },
            });

            return {
                success: true,
                count: productCategories.length,
                data: productCategories,
            };
        } catch (error) {
            console.error('[GetProductCategoryUseCase]: ', error);
            throw new InternalServerErrorException('Failed to fetch product categories');
        }
    }
}
