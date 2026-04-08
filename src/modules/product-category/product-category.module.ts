import { Module } from '@nestjs/common';
import { ProductCategoryController } from './product-category.controller';
import { CreateProductCategoryUseCase } from './application/create-product-category.usecase';
import { UpdateProductCategoryUseCase } from './application/update-product-category.usecase';
import { GetProductCategoryUseCase } from './application/get-product-category.usecase';
import { DeleteProductCategoryUseCase } from './application/delete-product-category.usecase';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Module({
    controllers: [ProductCategoryController],
    providers: [
        CreateProductCategoryUseCase,
        UpdateProductCategoryUseCase,
        GetProductCategoryUseCase,
        DeleteProductCategoryUseCase,
        PrismaService,
    ],
    exports: [
        CreateProductCategoryUseCase,
        UpdateProductCategoryUseCase,
        GetProductCategoryUseCase,
        DeleteProductCategoryUseCase,
    ],
})
export class ProductCategoryModule {}
