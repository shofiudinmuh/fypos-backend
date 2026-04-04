import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class GetEmployeesUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string) {
        try {
            const employees = await this.prisma.user.findMany({
                where: {
                    tenant_id: tenantId,
                    deleted_at: null,
                },
                orderBy: {
                    created_at: 'desc',
                },
                include: {
                    outlets: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            return {
                success: true,
                count: employees.length,
                data: employees.map((user) => ({
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    outlet_name: user.outlets?.name,
                    is_active: user.is_active,
                })),
            };
        } catch (error) {
            console.error('[GetEmployeesUseCase]: ', error);
            throw new InternalServerErrorException('Failed to fetch employees list');
        }
    }
}
