import { Module } from '@nestjs/common';
import { AuditLogController } from './audit-log.controller';
import { GetAuditLogsUseCase } from './application/get-audit-logs.usecase';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Module({
    controllers: [AuditLogController],
    providers: [GetAuditLogsUseCase, PrismaService],
    exports: [GetAuditLogsUseCase],
})
export class AuditLogModule {}
