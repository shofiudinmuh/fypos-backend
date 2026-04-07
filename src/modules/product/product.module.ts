import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { CreateProductUseCase } from './application/create-product.usecase';
import { UpdateProductUseCase } from './application/update-product.usecase';
import { GetProductUseCase } from './application/get-product.usecase';
import { DeleteProductUseCase } from './application/delete-product.usecase';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { FileUploadService } from 'src/common/services/file-upload.service';

@Module({
    controllers: [ProductController],
    providers: [
        CreateProductUseCase,
        UpdateProductUseCase,
        GetProductUseCase,
        DeleteProductUseCase,
        PrismaService,
        FileUploadService,
    ],
    exports: [
        CreateProductUseCase,
        UpdateProductUseCase,
        GetProductUseCase,
        DeleteProductUseCase,
    ],
})
export class ProductModule {}
