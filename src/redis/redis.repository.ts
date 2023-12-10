import { Redis } from 'ioredis';
import { Injectable, Logger, Inject, InternalServerErrorException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IORedisKey } from './redis.module';
import { RedisDto1, RedisDto2 } from './dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisRepository {
  // to use time-to-live from configuration
  private readonly ttl: string;
  private readonly logger = new Logger(RedisRepository.name);

  constructor(
    configService: ConfigService,
    @Inject(IORedisKey) private readonly redisClient: Redis,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    this.ttl = configService.get('data_DURATION');
  }

  async store<T>({ data, key }: any): Promise<T> {
    try {
      await this.cacheManager.set(key, JSON.stringify(data), Number(this.ttl));
      return data as T;
    } catch (e) {
      this.logger.error(`Failed to add data {e}`, e);
      throw new InternalServerErrorException();
    }
  }

  async get<T>(key: string, searchByValue: string, propertyName: any): Promise<T> {
    try {
      const data: any = await this.cacheManager.get(key);
      const jsonList = JSON.parse(data);
      const result = jsonList.find(d => d[propertyName] == searchByValue);
      return result as T;
    } catch (e) {
      this.logger.error(`Failed to get dataID ${key}`);
      throw new InternalServerErrorException(`Failed to get dataID ${key}`);
    }
  }

  async getAll<T>(key: string): Promise<T> {
    try {
      const data: any = await this.cacheManager.get(key);
      if (data) {
        const jsonList = JSON.parse(data);
        return jsonList as T;
      }
      return null;
    } catch (e) {
      this.logger.error(`Failed to get d`, e);
      throw new InternalServerErrorException(`Failed to get dataID ${key}`);
    }
  }

  async update<T>(key: string, searchByValue: string, propertyName: any, data: any): Promise<T> {
    try {
      const item = await this.get<T>(key, searchByValue, propertyName);
      console.log('item', item);
      
      if (item) {
        var newRecord = this.removeFromDataList(searchByValue, propertyName, data);
        console.log('newRecord', newRecord);
        await this.cacheManager.set(key, JSON.stringify(newRecord));
      } else {
        console.log('data', data);
        
        await this.cacheManager.set(key, JSON.stringify(data));
      }
      return data as T;
    } catch (e) {
      this.logger.error(`Failed to add a participant with  dataID: ${key}`);
      throw new InternalServerErrorException(`Failed to add a participant with  dataID: ${key}`);
    }
  }

  async updateList<T>(key: string, data: any): Promise<T> {
    try {
      const record = await this.cacheManager.get(key);
      if (record) {
        console.log('1');
        
        await this.cacheManager.del(key);
        await this.cacheManager.set(key, JSON.stringify(data));
      } else {
        console.log('2');
        await this.cacheManager.set(key, JSON.stringify(data));
      }
      return data as T;
    } catch (e) {
      this.logger.error(`Failed to add a participant with  dataID: ${key}`);
      throw new InternalServerErrorException(`Failed to add a participant with  dataID: ${key}`);
    }
  }

  async remove(key: string): Promise<any> {
    try {
      await this.cacheManager.del(key);
      return null;
    } catch (e) {
      this.logger.error(`Failed to remove from data`, e);
      throw new InternalServerErrorException('Failed to remove participant');
    }
  }

  async removeFromDataList(searchByValue: string, propertyName: any, jsonList: any): Promise<any> {
    try {
      const newRcord = jsonList.filter(d => d[propertyName] != searchByValue);
      return newRcord;
    } catch (e) {
      this.logger.error(`Failed to remove from data`, e);
      throw new InternalServerErrorException('Failed to remove participant');
    }
  }


}