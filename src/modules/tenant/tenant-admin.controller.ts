import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ManualTenantRegisterUseCase, ManualTenantRegisterDto } from './application/manual-tenant-register.usecase';

@ApiTags('Admin / Tenants')
@ApiBearerAuth()
@Controller('admin/tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantAdminController {
    constructor(private readonly manualTenantRegisterUseCase: ManualTenantRegisterUseCase) {}

    @Post('manual')
    @Roles('SUPERADMIN')
    @ApiOperation({ summary: 'Register New Tenant Manually (Back-office)' })
    @ApiResponse({ status: 201, description: 'Tenant registered manually' })
    async registerManual(@CurrentUser() user: any, @Body() dto: ManualTenantRegisterDto) {
        return this.manualTenantRegisterUseCase.execute(dto, user.user_id);
    }
}
