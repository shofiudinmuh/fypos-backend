import { Injectable, Inject } from '@nestjs/common';
import { REDIS_CLIENT } from '../database/redis.provider';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheService {
    constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClientType) {}

    async set(key: string, value: any, ttl: number = 3600): Promise<void> {
        const stringValue = JSON.stringify(value);
        await this.redis.set(key, stringValue, { EX: ttl });
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.redis.get(key);
        return data ? (JSON.parse(data) as T) : null;
    }

    async delete(key: string): Promise<void> {
        await this.redis.del(key);
    }
}
