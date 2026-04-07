import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { CreateProductIngredientUseCase } from './application/create-product-ingredient.usecase';
import { UpdateProductIngredientUseCase } from './application/update-product-ingredient.usecase';
import { GetProductIngredientUseCase } from './application/get-product-ingredient.usecase';
import { DeleteProductIngredientUseCase } from './application/delete-product-ingredient.usecase';
import { CreateProductIngredientDto } from './dto/create-product-ingredient.dto';
import { UpdateProductIngredientDto } from './dto/update-product-ingredient.dto';

@ApiTags('Product Ingredients')
@ApiBearerAuth()
@Controller('product-ingredients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductIngredientController {
    constructor(
        private readonly createProductIngredientUseCase: CreateProductIngredientUseCase,
        private readonly getProductIngredientUseCase: GetProductIngredientUseCase,
        private readonly updateProductIngredientUseCase: UpdateProductIngredientUseCase,
        private readonly deleteProductIngredientUseCase: DeleteProductIngredientUseCase,
    ) {}

    @Post()
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Create New Product Ingredient' })
    @ApiResponse({ status: 201, description: 'Product ingredient created successfully' })
    async create(@CurrentUser() user: any, @Body() dto: CreateProductIngredientDto) {
        return this.createProductIngredientUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            dto,
        );
    }

    @Get()
    @Roles('OWNER', 'MANAGER', 'ADMIN', 'CASHIER')
    @ApiOperation({ summary: 'Get All Product Ingredients' })
    @ApiQuery({ name: 'product_id', required: false, description: 'Filter by product ID' })
    @ApiResponse({ status: 200, description: 'Product ingredients fetched successfully' })
    async findAll(@CurrentUser() user: any, @Query('product_id') productId?: string) {
        return this.getProductIngredientUseCase.execute(user.tenant_id, user.outlet_id, undefined, productId);
    }

    @Get(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN', 'CASHIER')
    @ApiOperation({ summary: 'Get Product Ingredient by ID' })
    @ApiResponse({ status: 200, description: 'Product ingredient fetched successfully' })
    async findOne(@CurrentUser() user: any, @Param('id') ingredientId: string) {
        return this.getProductIngredientUseCase.execute(user.tenant_id, user.outlet_id, ingredientId);
    }

    @Patch(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Update Product Ingredient' })
    @ApiResponse({ status: 200, description: 'Product ingredient updated successfully' })
    async update(
        @CurrentUser() user: any,
        @Param('id') ingredientId: string,
        @Body() dto: UpdateProductIngredientDto,
    ) {
        return this.updateProductIngredientUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            ingredientId,
            dto,
        );
    }

    @Delete(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Delete Product Ingredient' })
    @ApiResponse({ status: 200, description: 'Product ingredient deleted successfully' })
    async delete(@CurrentUser() user: any, @Param('id') ingredientId: string) {
        return this.deleteProductIngredientUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            ingredientId,
        );
    }
}
