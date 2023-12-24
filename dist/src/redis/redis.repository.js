"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RedisRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisRepository = void 0;
const ioredis_1 = require("ioredis");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const redis_module_1 = require("./redis.module");
const cache_manager_1 = require("@nestjs/cache-manager");
let RedisRepository = RedisRepository_1 = class RedisRepository {
    constructor(configService, redisClient, cacheManager) {
        this.redisClient = redisClient;
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(RedisRepository_1.name);
        this.ttl = configService.get('7200');
    }
    async store({ data, key }) {
        try {
            await this.cacheManager.set(key, JSON.stringify(data), Number(this.ttl));
            return data;
        }
        catch (e) {
            this.logger.error(`Failed to add data {e}`, e);
            throw new common_1.InternalServerErrorException();
        }
    }
    async get(key, searchByValue, propertyName) {
        try {
            const data = await this.cacheManager.get(key);
            const jsonList = JSON.parse(data);
            const result = jsonList.find(d => d[propertyName] == searchByValue);
            return result;
        }
        catch (e) {
            this.logger.error(`Failed to get dataID ${key}`);
            throw new common_1.InternalServerErrorException(`Failed to get dataID ${key}`);
        }
    }
    async getAll(key) {
        try {
            const data = await this.cacheManager.get(key);
            if (data) {
                const jsonList = JSON.parse(data);
                return jsonList;
            }
            return null;
        }
        catch (e) {
            this.logger.error(`Failed to get d`, e);
            throw new common_1.InternalServerErrorException(`Failed to get dataID ${key}`);
        }
    }
    async update(key, searchByValue, propertyName, data) {
        try {
            const item = await this.get(key, searchByValue, propertyName);
            console.log('item', item);
            if (item) {
                var newRecord = this.removeFromDataList(searchByValue, propertyName, data);
                console.log('newRecord', newRecord);
                await this.cacheManager.set(key, JSON.stringify(newRecord));
            }
            else {
                console.log('data', data);
                await this.cacheManager.set(key, JSON.stringify(data));
            }
            return data;
        }
        catch (e) {
            this.logger.error(`Failed to add a participant with  dataID: ${key}`);
            throw new common_1.InternalServerErrorException(`Failed to add a participant with  dataID: ${key}`);
        }
    }
    async updateList(key, data) {
        try {
            const record = await this.cacheManager.get(key);
            if (record) {
                console.log('1');
                await this.cacheManager.del(key);
                await this.cacheManager.set(key, JSON.stringify(data));
            }
            else {
                console.log('2');
                await this.cacheManager.set(key, JSON.stringify(data));
            }
            return data;
        }
        catch (e) {
            this.logger.error(`Failed to add a participant with  dataID: ${key}`);
            throw new common_1.InternalServerErrorException(`Failed to add a participant with  dataID: ${key}`);
        }
    }
    async remove(key) {
        try {
            await this.cacheManager.del(key);
            return null;
        }
        catch (e) {
            this.logger.error(`Failed to remove from data`, e);
            throw new common_1.InternalServerErrorException('Failed to remove participant');
        }
    }
    async removeFromDataList(searchByValue, propertyName, jsonList) {
        try {
            const newRcord = jsonList.filter(d => d[propertyName] != searchByValue);
            return newRcord;
        }
        catch (e) {
            this.logger.error(`Failed to remove from data`, e);
            throw new common_1.InternalServerErrorException('Failed to remove participant');
        }
    }
};
exports.RedisRepository = RedisRepository;
exports.RedisRepository = RedisRepository = RedisRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(redis_module_1.IORedisKey)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        ioredis_1.Redis, Object])
], RedisRepository);
//# sourceMappingURL=redis.repository.js.map