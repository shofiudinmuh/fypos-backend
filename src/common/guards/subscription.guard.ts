import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SubscriptionGuard implements CanActivate {
    constructor(
        private prisma: PrismaService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const tenantId = context.switchToHttp().getRequest().headers['x-tenant-id'];
        if (!tenantId) throw new ForbiddenException('Tenant ID required');

        const tenant = await this.prisma.tenant.findUnique({
            where: { tenant_id: tenantId },
            select: {
                trial_end_at: true,
                subscription_status: true,
                subscription_end_at: true,
                grace_period_end_at: true,
            },
        });

        if (!tenant) {
            throw new ForbiddenException({
                code: 'TENANT_NOT_FOUND',
                message: 'Tenant not found',
            });
        }

        const now = new Date();
        const isActive =
            (tenant.trial_end_at && tenant.trial_end_at > now) ||
            (tenant.subscription_status === 'active' && tenant.subscription_end_at! > now) ||
            (tenant.grace_period_end_at && tenant.grace_period_end_at > now);

        if (!isActive) {
            throw new ForbiddenException({
                code: 'SUBSCRIPTION_EXPIRED',
                message: 'Free trial is expired, please subscribe!',
                redirect: '/subscribe',
            });
        }
        return true;
    }
}
