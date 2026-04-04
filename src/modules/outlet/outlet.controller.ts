import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateOutletUseCase } from './application/create-outlet.usecase';
import { GetOutletsUseCase } from './application/get-outlets.usecase';
import { UpdateOutletUseCase } from './application/update-outlet.usecase';
import { DeleteOutletUseCase } from './application/delete-outlet.usecase';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';

@ApiTags('Outlets')
@ApiBearerAuth()
@Controller('outlets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OutletController {
    constructor(
        private readonly createOutletUseCase: CreateOutletUseCase,
        private readonly getOutletsUseCase: GetOutletsUseCase,
        private readonly updateOutletUseCase: UpdateOutletUseCase,
        private readonly deleteOutletUseCase: DeleteOutletUseCase,
    ) {}

    @Post()
    @Roles('OWNER', 'ADMIN')
    @ApiOperation({ summary: 'Create New Outlet' })
    @ApiResponse({ status: 201, description: 'Outlet created successfully' })
    async create(@CurrentUser() user: any, @Body() dto: CreateOutletDto) {
        return this.createOutletUseCase.execute(user.tenant_id, user.user_id, dto);
    }

    @Get()
    @Roles('OWNER', 'ADMIN', 'CASHIER')
    @ApiOperation({ summary: 'Get All Outlets' })
    @ApiResponse({ status: 200, description: 'Outlets fetched successfully' })
    async findAll(@CurrentUser() user: any) {
        return this.getOutletsUseCase.execute(user.tenant_id);
    }

    @Patch(':id')
    @Roles('OWNER', 'ADMIN')
    @ApiOperation({ summary: 'Update Outlet Info' })
    @ApiResponse({ status: 200, description: 'Outlet updated successfully' })
    async update(
        @CurrentUser() user: any,
        @Param('id') outletId: string,
        @Body() dto: UpdateOutletDto,
    ) {
        return this.updateOutletUseCase.execute(user.tenant_id, user.user_id, outletId, dto);
    }

    @Delete(':id')
    @Roles('OWNER', 'ADMIN')
    @ApiOperation({ summary: 'Delete Outlet (Soft Delete)' })
    @ApiResponse({ status: 200, description: 'Outlet deleted successfully' })
    async delete(@CurrentUser() user: any, @Param('id') outletId: string) {
        return this.deleteOutletUseCase.execute(user.tenant_id, user.user_id, outletId);
    }
}
