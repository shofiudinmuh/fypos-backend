import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantRegisterUseCase } from './application/tenant-register.usecase';
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
    controllers: [TenantController],
    providers: [TenantRegisterUseCase, PrismaService],
})
export class TenantModule {}
