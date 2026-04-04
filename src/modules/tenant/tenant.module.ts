import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantAdminController } from './tenant-admin.controller';
import { TenantRegisterUseCase } from './application/tenant-register.usecase';
import { UpdateTenantProfileUseCase } from './application/update-tenant-profile.usecase';
import { ManualTenantRegisterUseCase } from './application/manual-tenant-register.usecase';
import { DeleteTenantUseCase } from './application/delete-tenant.usecase';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '24h' },
            }),
        }),
    ],
    controllers: [TenantController, TenantAdminController],
    providers: [TenantRegisterUseCase, UpdateTenantProfileUseCase, ManualTenantRegisterUseCase, DeleteTenantUseCase, PrismaService],
    exports: [TenantRegisterUseCase, UpdateTenantProfileUseCase, ManualTenantRegisterUseCase, DeleteTenantUseCase],
})
export class TenantModule {}
