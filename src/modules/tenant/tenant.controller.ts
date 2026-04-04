import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TenantRegisterUseCase } from './application/tenant-register.usecase';
import { TenantRegisterDto } from './dto/tenant-register.dto';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantController {
    constructor(private readonly tenantRegisterUseCase: TenantRegisterUseCase) {}

    @Post('register')
    @ApiOperation({ summary: 'New Tenant Registration' })
    @ApiResponse({ status: 201, description: 'Tenant created successfully' })
    async register(@Body() dto: TenantRegisterDto) {
        return this.tenantRegisterUseCase.execute(dto);
    }
}
