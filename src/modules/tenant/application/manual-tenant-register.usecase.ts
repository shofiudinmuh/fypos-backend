import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages.constants';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class ManualTenantRegisterDto {
    @ApiProperty({ example: 'B2B Client Name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'owner@b2b.com' })
    @IsEmail()
    @IsNotEmpty()
    ownerEmail: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    password?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    businessType?: string;
    
    // Admin specific fields
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    subscription_plan_id?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    custom_trial_days?: number;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    direct_activate?: boolean;
}

@Injectable()
export class ManualTenantRegisterUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(dto: ManualTenantRegisterDto, authorId: string) {
        try {
            const existingTenant = await this.prisma.tenant.findUnique({
                where: { owner_email: dto.ownerEmail },
            });

            if (existingTenant) {
                throw new ConflictException(ERROR_MESSAGES.TENANT.ALREADY_REGISTERED);
            }

            const rawPassword = dto.password || crypto.randomBytes(8).toString('hex');
            const passwordHash = await bcrypt.hash(rawPassword, 10);

            const trialDays = dto.custom_trial_days ?? 30;
            const trialEndAt = new Date();
            trialEndAt.setDate(trialEndAt.getDate() + trialDays);

            const tenant = await this.prisma.$transaction(async (tx) => {
                const newTenant = await tx.tenant.create({
                    data: {
                        name: dto.name,
                        owner_email: dto.ownerEmail,
                        phone: dto.phone,
                        address: dto.address,
                        business_type: dto.businessType,
                        trial_end_at: trialEndAt,
                        subscription_status: dto.direct_activate ? 'active' : 'trial',
                        subscription_plan_id: dto.subscription_plan_id || null,
                    },
                });

                // 2. Create Default Outlet
                const defaultOutlet = await tx.outlet.create({
                    data: {
                        tenant_id: newTenant.tenant_id,
                        name: 'Main Outlet',
                        address: dto.address || 'Address not set',
                        phone: dto.phone || '0000000000',
                        outlet_code: `OUT-MAIN-${newTenant.tenant_id.slice(-4).toUpperCase()}`,
                    },
                });

                // 3. Create Owner User
                const user = await tx.user.create({
                    data: {
                        tenant_id: newTenant.tenant_id,
                        outlet_id: defaultOutlet.outlet_id,
                        name: dto.name,
                        email: dto.ownerEmail,
                        password_hash: passwordHash,
                        role: Role.OWNER,
                        is_active: true,
                    },
                });

                // 4. Audit Log
                await tx.auditLog.create({
                    data: {
                        tenant_id: newTenant.tenant_id,
                        outlet_id: defaultOutlet.outlet_id,
                        user_id: authorId,
                        action: 'CREATE',
                        entity: 'Tenant',
                        entity_id: newTenant.tenant_id,
                        new_value: {
                            registration_type: 'MANUAL',
                            is_direct_activate: dto.direct_activate,
                            plan_id: dto.subscription_plan_id,
                        },
                    },
                });

                return {
                    tenant_id: newTenant.tenant_id,
                    owner_email: newTenant.owner_email,
                    raw_password: dto.password ? 'User Defined' : rawPassword,
                };
            });

            return {
                success: true,
                message: 'Tenant manually registered by admin',
                data: tenant,
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            console.error('[ManualTenantRegisterUseCase]: ', error);
            throw new InternalServerErrorException(ERROR_MESSAGES.TENANT.REGISTRATION_ERROR);
        }
    }
}
