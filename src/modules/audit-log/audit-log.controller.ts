import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GetAuditLogsUseCase } from './application/get-audit-logs.usecase';
import { GetAuditLogsQueryDto } from './dto/get-audit-logs-query.dto';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditLogController {
    constructor(private readonly getAuditLogsUseCase: GetAuditLogsUseCase) {}

    @Get()
    @Roles('OWNER')
    @ApiOperation({ summary: 'Get Audit Log History' })
    @ApiResponse({ status: 200, description: 'Audit logs fetched successfully' })
    async findAll(@CurrentUser() user: any, @Query() query: GetAuditLogsQueryDto) {
        return this.getAuditLogsUseCase.execute(user.tenant_id, query);
    }
}
