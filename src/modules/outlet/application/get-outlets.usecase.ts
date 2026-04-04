import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class GetOutletsUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string) {
        try {
            const outlets = await this.prisma.outlet.findMany({
                where: {
                    tenant_id: tenantId,
                    deleted_at: null,
                },
                orderBy: {
                    created_at: 'desc',
                },
            });

            return {
                success: true,
                count: outlets.length,
                data: outlets,
            };
        } catch (error) {
            console.error('[GetOutletsUseCase]: ', error);
            throw new InternalServerErrorException('Failed to fetch outlets');
        }
    }
}
