import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateProductCategoryUseCase } from './application/create-product-category.usecase';
import { UpdateProductCategoryUseCase } from './application/update-product-category.usecase';
import { GetProductCategoryUseCase } from './application/get-product-category.usecase';
import { DeleteProductCategoryUseCase } from './application/delete-product-category.usecase';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@ApiTags('Product Categories')
@ApiBearerAuth()
@Controller('product-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductCategoryController {
    constructor(
        private readonly createProductCategoryUseCase: CreateProductCategoryUseCase,
        private readonly getProductCategoryUseCase: GetProductCategoryUseCase,
        private readonly updateProductCategoryUseCase: UpdateProductCategoryUseCase,
        private readonly deleteProductCategoryUseCase: DeleteProductCategoryUseCase,
    ) {}

    @Post()
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Create New Product Category' })
    @ApiResponse({ status: 201, description: 'Product category created successfully' })
    async create(@CurrentUser() user: any, @Body() dto: CreateProductCategoryDto) {
        return this.createProductCategoryUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            dto,
        );
    }

    @Get()
    @Roles('OWNER', 'MANAGER', 'ADMIN', 'CASHIER')
    @ApiOperation({ summary: 'Get All Product Categories' })
    @ApiResponse({ status: 200, description: 'Product Categories fetched successfully' })
    async findAll(@CurrentUser() user: any) {
        return this.getProductCategoryUseCase.execute(user.tenant_id, user.outlet_id);
    }

    @Patch(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Update Product Category' })
    @ApiResponse({ status: 200, description: 'Product category updated successfully' })
    async update(
        @CurrentUser() user: any,
        @Param('id') productCategoryId: string,
        @Body() dto: UpdateProductCategoryDto,
    ) {
        return this.updateProductCategoryUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            productCategoryId,
            dto,
        );
    }

    @Delete(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Delete Product Category' })
    @ApiResponse({ status: 200, description: 'Product category deleted successfully' })
    async delete(@CurrentUser() user: any, @Param('id') productCategoryId: string) {
        return this.deleteProductCategoryUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            productCategoryId,
        );
    }
}
