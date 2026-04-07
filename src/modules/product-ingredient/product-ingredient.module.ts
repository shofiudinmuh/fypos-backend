import { Module } from '@nestjs/common';
import { ProductIngredientController } from './product-ingredient.controller';
import { CreateProductIngredientUseCase } from './application/create-product-ingredient.usecase';
import { UpdateProductIngredientUseCase } from './application/update-product-ingredient.usecase';
import { GetProductIngredientUseCase } from './application/get-product-ingredient.usecase';
import { DeleteProductIngredientUseCase } from './application/delete-product-ingredient.usecase';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Module({
    controllers: [ProductIngredientController],
    providers: [
        CreateProductIngredientUseCase,
        UpdateProductIngredientUseCase,
        GetProductIngredientUseCase,
        DeleteProductIngredientUseCase,
        PrismaService,
    ],
    exports: [
        CreateProductIngredientUseCase,
        UpdateProductIngredientUseCase,
        GetProductIngredientUseCase,
        DeleteProductIngredientUseCase,
    ],
})
export class ProductIngredientModule {}
