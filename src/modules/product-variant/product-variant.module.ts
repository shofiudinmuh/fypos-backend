import { Module } from '@nestjs/common';
import { ProductVariantController } from './product-variant.controller';
import { CreateProductVariantUseCase } from './application/create-product-variant.usecase';
import { UpdateProductVariantUseCase } from './application/update-product-variant.usecase';
import { GetProductVariantUseCase } from './application/get-product-variant.usecase';
import { DeleteProductVariantUseCase } from './application/delete-product-variant.usecase';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Module({
    controllers: [ProductVariantController],
    providers: [
        CreateProductVariantUseCase,
        UpdateProductVariantUseCase,
        GetProductVariantUseCase,
        DeleteProductVariantUseCase,
        PrismaService,
    ],
    exports: [
        CreateProductVariantUseCase,
        UpdateProductVariantUseCase,
        GetProductVariantUseCase,
        DeleteProductVariantUseCase,
    ],
})
export class ProductVariantModule {}
