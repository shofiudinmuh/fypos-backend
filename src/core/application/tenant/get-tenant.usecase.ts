import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantRepository } from 'src/infrastructure/persistence/repositories/tenant.repository';
import { TenantEntity } from 'src/core/domain/entities/tenant.entity';

@Injectable()
export class GetTenantUseCase {
    constructor(private tenantRepo: TenantRepository) {}

    async execute(id: string): Promise<TenantEntity> {
        const tenant = await this.tenantRepo.findById(id);
        if (!tenant) {
            throw new NotFoundException('Tenant not found');
        }

        return tenant;
    }
}
