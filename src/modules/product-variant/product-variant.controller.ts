import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { CreateProductVariantUseCase } from './application/create-product-variant.usecase';
import { UpdateProductVariantUseCase } from './application/update-product-variant.usecase';
import { GetProductVariantUseCase } from './application/get-product-variant.usecase';
import { DeleteProductVariantUseCase } from './application/delete-product-variant.usecase';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@ApiTags('Product Variants')
@ApiBearerAuth()
@Controller('product-variants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductVariantController {
    constructor(
        private readonly createProductVariantUseCase: CreateProductVariantUseCase,
        private readonly getProductVariantUseCase: GetProductVariantUseCase,
        private readonly updateProductVariantUseCase: UpdateProductVariantUseCase,
        private readonly deleteProductVariantUseCase: DeleteProductVariantUseCase,
    ) {}

    @Post()
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Create New Product Variant' })
    @ApiResponse({ status: 201, description: 'Product variant created successfully' })
    async create(@CurrentUser() user: any, @Body() dto: CreateProductVariantDto) {
        return this.createProductVariantUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            dto,
        );
    }

    @Get()
    @Roles('OWNER', 'MANAGER', 'ADMIN', 'CASHIER')
    @ApiOperation({ summary: 'Get All Product Variants' })
    @ApiQuery({ name: 'product_id', required: false, description: 'Filter by product ID' })
    @ApiResponse({ status: 200, description: 'Product variants fetched successfully' })
    async findAll(@CurrentUser() user: any, @Query('product_id') productId?: string) {
        return this.getProductVariantUseCase.execute(user.tenant_id, user.outlet_id, undefined, productId);
    }

    @Get(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN', 'CASHIER')
    @ApiOperation({ summary: 'Get Product Variant by ID' })
    @ApiResponse({ status: 200, description: 'Product variant fetched successfully' })
    async findOne(@CurrentUser() user: any, @Param('id') variantId: string) {
        return this.getProductVariantUseCase.execute(user.tenant_id, user.outlet_id, variantId);
    }

    @Patch(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Update Product Variant' })
    @ApiResponse({ status: 200, description: 'Product variant updated successfully' })
    async update(
        @CurrentUser() user: any,
        @Param('id') variantId: string,
        @Body() dto: UpdateProductVariantDto,
    ) {
        return this.updateProductVariantUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            variantId,
            dto,
        );
    }

    @Delete(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Delete Product Variant' })
    @ApiResponse({ status: 200, description: 'Product variant deleted successfully' })
    async delete(@CurrentUser() user: any, @Param('id') variantId: string) {
        return this.deleteProductVariantUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            variantId,
        );
    }
}
