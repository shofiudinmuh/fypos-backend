import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider: Provider = {
    provide: REDIS_CLIENT,
    useFactory: async (configService: ConfigService) => {
        const client = createClient({
            url: `redis://${configService.get('REDIS_HOST') || 'localhost'}:${configService.get('REDIS_PORT')}`,
            password: configService.get('REDIS_PASSWORD'),
        });
        client.on('error', (err) => console.error('Redis client Error: ', err));

        await client.connect();
        return client;
    },
    inject: [ConfigService],
};
