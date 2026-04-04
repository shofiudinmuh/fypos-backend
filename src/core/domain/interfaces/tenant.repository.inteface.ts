import { TenantEntity } from '../entities/tenant.entity';

export interface ITenantRepository {
    findById(id: string): Promise<TenantEntity | null>;
    findByOwnerEmail(email: string): Promise<TenantEntity | null>;
    findAll(): Promise<TenantEntity[]>;
    create(data: Omit<TenantEntity, 'tenantId'>): Promise<TenantEntity>;
    update(id: string, data: Partial<Omit<TenantEntity, 'tenantId'>>): Promise<TenantEntity>;
    delete(id: string): Promise<void>;
}
