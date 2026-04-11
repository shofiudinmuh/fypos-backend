import { Controller, Post, Get, Patch, Delete, Param, UseGuards, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { CreateRegisterUseCase } from './application/create-register.usecase';
import { UpdateRegisterUseCase } from './application/update-register.usecase';
import { GetRegisterUseCase } from './application/get-register.usecase';
import { DeleteRegisterUseCase } from './application/delete-register.usecase';

@ApiTags('Registers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('registers')
export class RegisterController {
    constructor(
        private readonly createRegisterUseCase: CreateRegisterUseCase,
        private readonly getRegisterUseCase: GetRegisterUseCase,
        private readonly updateRegisterUseCase: UpdateRegisterUseCase,
        private readonly deleteRegisterUseCase: DeleteRegisterUseCase,
    ) {}

    @Post()
    @Roles('OWNER', 'MANAGER')
    @ApiOperation({ summary: 'Create New Register' })
    @ApiResponse({ status: 201, description: 'Register created successfully' })
    async create(@CurrentUser() user: any, @Body() dto: CreateRegisterDto) {
        return this.createRegisterUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            dto,
        );
    }

    @Get()
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Get All Registers' })
    @ApiResponse({ status: 200, description: 'Registers fetched successfully' })
    async findAll(@CurrentUser() user: any) {
        return this.getRegisterUseCase.execute(user.tenant_id, user.outlet_id, user.user_id);
    }

    @Get(':id')
    @Roles('OWNER', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Get Register by ID' })
    @ApiResponse({ status: 200, description: 'Register fetched successfully' })
    async findOne(@CurrentUser() user: any, @Param('id') registerId: string) {
        return this.getRegisterUseCase.execute(user.tenant_id, user.outlet_id, registerId);
    }

    @Patch(':id')
    @Roles('OWNER', 'MANAGER')
    @ApiOperation({ summary: 'Update Register' })
    @ApiResponse({ status: 200, description: 'Register updated successfully' })
    async update(
        @CurrentUser() user: any,
        @Param('id') registerId: string,
        @Body() dto: UpdateRegisterDto,
    ) {
        return this.updateRegisterUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            registerId,
            dto,
        );
    }

    @Delete(':id')
    @Roles('OWNER', 'MANAGER')
    @ApiOperation({ summary: 'Delete Register' })
    @ApiResponse({ status: 200, description: 'Register deleted successfully' })
    async remove(@CurrentUser() user: any, @Param('id') registerId: string) {
        return this.deleteRegisterUseCase.execute(
            user.tenant_id,
            user.outlet_id,
            user.user_id,
            registerId,
        );
    }
}
