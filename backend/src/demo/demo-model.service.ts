import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class DemoModelService {
  constructor(private readonly redisService: RedisService) {}

  async getModel(name?: string) {
    const normalizedName = name?.trim().toLowerCase() || 'default';
    const cacheKey = `demo:model:${normalizedName}`;

    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const model = {
      glbUrl: '/ropero-propuesta.glb',
      budget: {
        amount: 385000,
        currency: 'ARS',
      },
    };

    await this.redisService.set(cacheKey, model);
    return model;
  }
}
