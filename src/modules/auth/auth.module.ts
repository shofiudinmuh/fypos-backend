import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleAuthUseCase } from './application/google-auth.usecase';
import { LoginUseCase } from './application/login.usecase';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '24h' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        GoogleAuthUseCase,
        LoginUseCase,
        GoogleStrategy,
        GoogleAuthGuard,
        PrismaService,
    ],
})
export class AuthModule {}
