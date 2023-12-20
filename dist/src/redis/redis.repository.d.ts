import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
export declare class RedisRepository {
    private readonly redisClient;
    private cacheManager;
    private readonly ttl;
    private readonly logger;
    constructor(configService: ConfigService, redisClient: Redis, cacheManager: Cache);
    store<T>({ data, key }: any): Promise<T>;
    get<T>(key: string, searchByValue: string, propertyName: any): Promise<T>;
    getAll<T>(key: string): Promise<T>;
    update<T>(key: string, searchByValue: string, propertyName: any, data: any): Promise<T>;
    updateList<T>(key: string, data: any): Promise<T>;
    remove(key: string): Promise<any>;
    removeFromDataList(searchByValue: string, propertyName: any, jsonList: any): Promise<any>;
}
