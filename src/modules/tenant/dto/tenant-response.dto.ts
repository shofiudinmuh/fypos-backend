import { Expose } from 'class-transformer';

export class TenantResponseDto {
    @Expose() tenantId!: string;
    @Expose() name!: string;
    @Expose() ownerEmail!: string;
    @Expose() businessType!: string;
}
