import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { GetAuditLogsQueryDto } from '../dto/get-audit-logs-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class GetAuditLogsUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, query: GetAuditLogsQueryDto) {
        try {
            const whereClause: Prisma.AuditLogWhereInput = {
                tenant_id: tenantId,
                entity: query.entity ? { equals: query.entity, mode: 'insensitive' } : undefined,
                action: query.action ? { equals: query.action, mode: 'insensitive' } : undefined,
                outlet_id: query.outlet_id ? query.outlet_id : undefined,
                created_at:
                    query.startDate || query.endDate
                        ? {
                              gte: query.startDate ? new Date(query.startDate) : undefined,
                              lte: query.endDate ? new Date(query.endDate) : undefined,
                          }
                        : undefined,
            };

            const [totalCount, auditLogs] = await Promise.all([
                this.prisma.auditLog.count({ where: whereClause }),
                this.prisma.auditLog.findMany({
                    where: whereClause,
                    skip: query.skip,
                    take: query.take,
                    orderBy: {
                        created_at: 'desc',
                    },
                    include: {
                        users: {
                            select: {
                                name: true,
                                email: true,
                                role: true,
                            },
                        },
                        outlets: {
                            select: {
                                name: true,
                            },
                        },
                    },
                }),
            ]);

            return {
                success: true,
                count: auditLogs.length,
                total: totalCount,
                page: query.page,
                limit: query.limit,
                totalPages: Math.ceil(totalCount / (query.limit || 10)),
                data: auditLogs.map((log) => ({
                    id: log.audit_log_id,
                    action: log.action,
                    entity: log.entity,
                    entity_id: log.entity_id,
                    old_value: log.old_value,
                    new_value: log.new_value,
                    created_at: log.created_at,
                    user: log.users ? { name: log.users.name, email: log.users.email, role: log.users.role } : null,
                    outlet_name: log.outlets ? log.outlets.name : 'Global/System',
                })),
            };
        } catch (error) {
            console.error('[GetAuditLogsUseCase]: ', error);
            throw new InternalServerErrorException('Failed to fetch audit logs history');
        }
    }
}
