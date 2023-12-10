import { Test } from '@nestjs/testing';
import { RedisRepository } from './redis.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};

describe('RedisRepository', () => {
  let service: RedisRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        RedisRepository,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = moduleRef.get<RedisRepository>(RedisRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});