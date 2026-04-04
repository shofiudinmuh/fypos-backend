import { Injectable } from '@nestjs/common';
import { TenantRepository } from 'src/infrastructure/persistence/repositories/tenant.repository';
import { TenantEntity } from 'src/core/domain/entities/tenant.entity';

@Injectable()
export class CreateTenantUseCase {
    constructor(private tenantRepo: TenantRepository) {}

    async execute(
        name: string,
        ownerEmail: string,
        phone?: string,
        address?: string,
        businessType?: string,
        subscriptionPlanId?: string,
    ): Promise<TenantEntity> {
        const trialEndAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const subscriptionEndAt = new Date(Date.now() + 30 + 24 * 60 * 60 * 1000);
        const gracePeriodEndAt = new Date(Date.now() + 35 * 24 * 60 * 60 * 1000);

        return this.tenantRepo.create({
            name,
            ownerEmail,
            phone: phone ?? '',
            address: address ?? '',
            businessType: businessType ?? '',
            trialEndAt,
            subscriptionStatus: 'trial',
            subscriptionPlanId: subscriptionPlanId ?? '',
            subscriptionEndAt,
            gracePeriodEndAt,
        });
    }
}
