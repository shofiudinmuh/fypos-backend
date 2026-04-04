import { Controller, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { TenantRegisterUseCase } from './application/tenant-register.usecase';
import { UpdateTenantProfileUseCase } from './application/update-tenant-profile.usecase';
import { DeleteTenantUseCase } from './application/delete-tenant.usecase';
import { TenantRegisterDto } from './dto/tenant-register.dto';
import { UpdateTenantProfileDto } from './dto/update-tenant-profile.dto';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantController {
    constructor(
        private readonly tenantRegisterUseCase: TenantRegisterUseCase,
        private readonly updateTenantProfileUseCase: UpdateTenantProfileUseCase,
        private readonly deleteTenantUseCase: DeleteTenantUseCase,
    ) {}

    @Post('register')
    @ApiOperation({ summary: 'New Tenant Registration' })
    @ApiResponse({ status: 201, description: 'Tenant created successfully' })
    async register(@Body() dto: TenantRegisterDto) {
        return this.tenantRegisterUseCase.execute(dto);
    }

    @Patch('profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('OWNER')
    @ApiOperation({ summary: 'Update Tenant Profile' })
    @ApiResponse({ status: 200, description: 'Tenant profile updated successfully' })
    async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateTenantProfileDto) {
        return this.updateTenantProfileUseCase.execute(user.tenant_id, user.user_id, dto);
    }

    @Delete()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('OWNER')
    @ApiOperation({ summary: 'Close Tenant Account (Soft Delete)' })
    @ApiResponse({ status: 200, description: 'Tenant account closed successfully' })
    async delete(@CurrentUser() user: any) {
        return this.deleteTenantUseCase.execute(user.tenant_id, user.user_id);
    }
}
