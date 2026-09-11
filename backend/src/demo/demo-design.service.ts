import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class DemoDesignService {
  constructor(private readonly redisService: RedisService) {}

  async getDesign(prompt?: string) {
    const normalizedPrompt = prompt?.trim().toLowerCase() || 'default';
    const cacheKey = `demo:design:${normalizedPrompt}`;

    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const design = {
      name: 'Placard',
      sketchImage: '/placard-sketch.svg',
      measurements: [
        { label: 'Ancho', value: 120, unit: 'cm' },
        { label: 'Alto', value: 200, unit: 'cm' },
        { label: 'Profundidad', value: 55, unit: 'cm' },
      ],
    };

    await this.redisService.set(cacheKey, design);
    return design;
  }
}
