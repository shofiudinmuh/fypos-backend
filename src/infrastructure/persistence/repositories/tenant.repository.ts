import { Injectable } from '@nestjs/common';
import { ITenantRepository } from 'src/core/domain/interfaces/tenant.repository.inteface';
import { TenantEntity } from 'src/core/domain/entities/tenant.entity';
import { TenantMapper } from 'src/infrastructure/mappers/tenant.mapper';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class TenantRepository implements ITenantRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async findById(id: string): Promise<TenantEntity | null> {
        const record = await this.prismaService.tenant.findUnique({
            where: { tenant_id: id },
        });

        return record ? TenantMapper.toDomain(record) : null;
    }

    async findByOwnerEmail(email: string): Promise<TenantEntity | null> {
        const record = await this.prismaService.tenant.findUnique({
            where: { owner_email: email },
        });

        return record ? TenantMapper.toDomain(record) : null;
    }

    async findAll(): Promise<TenantEntity[]> {
        const records = await this.prismaService.tenant.findMany();
        return records.map(TenantMapper.toDomain);
    }

    async create(data: Omit<TenantEntity, 'tenantId'>): Promise<TenantEntity> {
        const created = await this.prismaService.tenant.create({
            data: {
                name: data.name,
                owner_email: data.ownerEmail,
                phone: data.phone,
                address: data.address,
                business_type: data.businessType,
                trial_end_at: data.trialEndAt,
                subscription_status: data.subscriptionStatus,
                subscription_plan_id: data.subscriptionPlanId,
                subscription_end_at: data.subscriptionEndAt,
                grace_period_end_at: data.gracePeriodEndAt,
            },
        });

        return TenantMapper.toDomain(created);
    }

    async update(id: string, data: Partial<Omit<TenantEntity, 'tenantId'>>): Promise<TenantEntity> {
        const updated = await this.prismaService.tenant.update({
            where: { tenant_id: id },
            data: {
                name: data.name,
                owner_email: data.ownerEmail,
                phone: data.phone,
                address: data.address,
                business_type: data.businessType,
                trial_end_at: data.trialEndAt,
                subscription_status: data.subscriptionStatus,
                subscription_plan_id: data.subscriptionPlanId,
                subscription_end_at: data.subscriptionEndAt,
                grace_period_end_at: data.gracePeriodEndAt,
            },
        });

        return TenantMapper.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        // implement delete funtion for softdelete
        await this.prismaService.tenant.update({
            where: { tenant_id: id },
            data: {
                deleted_at: new Date(),
            },
        });
    }
}
