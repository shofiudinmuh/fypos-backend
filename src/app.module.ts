import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './modules/tenant/tenant.module';
import { AuthModule } from './modules/auth/auth.module';
import { OutletModule } from './modules/outlet/outlet.module';
import { UserManagementModule } from './modules/user-management/user-management.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { BullModule } from '@nestjs/bullmq';
import { RedisProvider } from './infrastructure/database/redis.provider';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { ProductModule } from './modules/product/product.module';
import { ProductVariantModule } from './modules/product-variant/product-variant.module';
import { ProductIngredientModule } from './modules/product-ingredient/product-ingredient.module';
import { IngredientModule } from './modules/ingredient/ingredient.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads',
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                connection: {
                    host: configService.get<string>('REDIS_HOST', 'localhost'),
                    port: configService.get<number>('REDIS_PORT', 6379),
                },
            }),
            inject: [ConfigService],
        }),
        TenantModule,
        AuthModule,
        OutletModule,
        UserManagementModule,
        ProductCategoryModule,
        ProductModule,
        ProductVariantModule,
        IngredientModule,
        ProductIngredientModule,
        AuditLogModule,
    ],
    controllers: [AppController],
    providers: [AppService, RedisProvider],
})
export class AppModule {}
