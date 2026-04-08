import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { CreateIngredientUseCase } from './application/create-ingredient.usecase';
import { GetIngredientUseCase } from './application/get-ingredient.usecase';
import { UpdateIngredientUseCase } from './application/update-ingredient.usecase';
import { DeleteIngredientUseCase } from './application/delete-ingredient.usecase';

@ApiTags('Ingredients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ingredients')
export class IngredientController {
    constructor(
        private readonly createIngredientUseCase: CreateIngredientUseCase,
        private readonly getIngredientUseCase: GetIngredientUseCase,
        private readonly updateIngredientUseCase: UpdateIngredientUseCase,
        private readonly deleteIngredientUseCase: DeleteIngredientUseCase,
    ) {}

    @Post()
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Create New Ingredient' })
    @ApiResponse({ status: 201, description: 'Ingredient created successfully' })
    async create(@CurrentUser() user: any, @Body() dto: CreateIngredientDto) {
        return this.createIngredientUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            dto,
        );
    }

    @Get()
    @Roles('OWNER', 'MANAGER', 'ADMIN', 'CASHIER')
    @ApiOperation({ summary: 'Get All Ingredients' })
    @ApiResponse({ status: 200, description: 'Ingredients fetched successfully' })
    async findAll(@CurrentUser() user: any) {
        return this.getIngredientUseCase.execute(user.tenant_id, user.outlet_id);
    }

    @Get(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN', 'CASHIER')
    @ApiOperation({ summary: 'Get Ingredient by ID' })
    @ApiResponse({ status: 200, description: 'Ingredient fetched successfully' })
    async findOne(@CurrentUser() user: any, @Param('id') ingredientId: string) {
        return this.getIngredientUseCase.execute(user.tenant_id, user.outlet_id, ingredientId);
    }

    @Patch(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Update Ingredient' })
    @ApiResponse({ status: 200, description: 'Ingredient updated successfully' })
    async update(
        @CurrentUser() user: any,
        @Param('id') ingredientId: string,
        @Body() dto: UpdateIngredientDto,
    ) {
        return this.updateIngredientUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            ingredientId,
            dto,
        );
    }

    @Delete(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Soft delete Ingredient' })
    @ApiResponse({ status: 200, description: 'Ingredient deleted successfully' })
    async remove(@CurrentUser() user: any, @Param('id') ingredientId: string) {
        return this.deleteIngredientUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            ingredientId,
        );
    }
}
