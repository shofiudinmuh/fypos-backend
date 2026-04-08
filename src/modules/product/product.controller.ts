import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { CreateProductUseCase } from './application/create-product.usecase';
import { UpdateProductUseCase } from './application/update-product.usecase';
import { GetProductUseCase } from './application/get-product.usecase';
import { DeleteProductUseCase } from './application/delete-product.usecase';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
    constructor(
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly getProductUseCase: GetProductUseCase,
        private readonly updateProductUseCase: UpdateProductUseCase,
        private readonly deleteProductUseCase: DeleteProductUseCase,
    ) {}

    @Post()
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Create New Product' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @CurrentUser() user: any, 
        @Body() dto: CreateProductDto,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        return this.createProductUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            dto,
            image
        );
    }

    @Get()
    @Roles('OWNER', 'MANAGER', 'ADMIN', 'CASHIER')
    @ApiOperation({ summary: 'Get All Products' })
    @ApiResponse({ status: 200, description: 'Products fetched successfully' })
    async findAll(@CurrentUser() user: any) {
        return this.getProductUseCase.execute(user.tenant_id, user.outlet_id);
    }

    @Get(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN', 'CASHIER')
    @ApiOperation({ summary: 'Get Product by ID' })
    @ApiResponse({ status: 200, description: 'Product fetched successfully' })
    async findOne(@CurrentUser() user: any, @Param('id') productId: string) {
        return this.getProductUseCase.execute(user.tenant_id, user.outlet_id, productId);
    }

    @Patch(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Update Product' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @CurrentUser() user: any,
        @Param('id') productId: string,
        @Body() dto: UpdateProductDto,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        return this.updateProductUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            productId,
            dto,
            image
        );
    }

    @Delete(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Delete Product' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    async delete(@CurrentUser() user: any, @Param('id') productId: string) {
        return this.deleteProductUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            productId,
        );
    }
}
