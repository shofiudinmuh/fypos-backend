import { TenantEntity } from 'src/core/domain/entities/tenant.entity';
// import { Tenant as TenantPrisma } from '@prisma/client';
import { Tenant as TenantPrisma } from 'generated/prisma';

export class TenantMapper {
    static toDomain(prisma: TenantPrisma): TenantEntity {
        return new TenantEntity(
            prisma.tenant_id,
            prisma.name,
            prisma.owner_email,
            prisma.phone ?? '',
            prisma.address ?? '',
            prisma.business_type ?? '',
            prisma.trial_end_at,
            prisma.subscription_status as any,
            prisma.subscription_plan_id ?? '',
            prisma.subscription_end_at ?? new Date(),
            prisma.grace_period_end_at ?? new Date(),
        );
    }
    static toPersistence(
        domain: TenantEntity,
    ): Omit<TenantPrisma, 'created_at' | 'updated_at' | 'deleted_at'> {
        return {
            tenant_id: domain.tenantId,
            name: domain.name,
            owner_email: domain.ownerEmail,
            phone: domain.phone,
            address: domain.address,
            business_type: domain.businessType,
            trial_end_at: domain.trialEndAt,
            subscription_status: domain.subscriptionStatus,
            subscription_plan_id: domain.subscriptionPlanId,
            subscription_end_at: domain.subscriptionEndAt,
            grace_period_end_at: domain.gracePeriodEndAt,
        };
    }
}
