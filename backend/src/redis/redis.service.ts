import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  Optional,
} from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;
  private readonly defaultTtl: number;

  constructor(@Optional() @Inject(REDIS_CLIENT) client?: Redis) {
    this.defaultTtl = Number(process.env.REDIS_TTL ?? 300);

    if (client) {
      this.client = client;
      return;
    }

    const host = process.env.REDIS_HOST ?? 'localhost';
    const port = Number(process.env.REDIS_PORT ?? 6379);
    const redisUrl = process.env.REDIS_URL;

    const options = {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      connectTimeout: 1000,
      commandTimeout: 1500,
      retryStrategy: (times: number) => Math.min(times * 200, 3000),
    };

    this.client = redisUrl
      ? new Redis(redisUrl, options)
      : new Redis({ host, port, ...options });

    this.client.on('error', (err: Error) => {
      this.logger.warn(`Redis client error: ${err.message}`);
    });

    this.client.on('connect', () => {
      this.logger.log('Connected to Redis');
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      if (this.client.status === 'wait') {
        await this.client.connect();
      }
    } catch (err) {
      this.logger.warn(
        `Initial Redis connection failed: ${(err as Error).message}. Operating in fallback mode.`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (this.client.status !== 'end') {
        this.client.disconnect();
      }
    } catch {
      // ignore
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) {
        return null;
      }
      return JSON.parse(data) as T;
    } catch (err) {
      this.logger.warn(`Redis GET failed for key "${key}": ${(err as Error).message}. Falling back.`);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const ttl = ttlSeconds !== undefined ? ttlSeconds : this.defaultTtl;
    try {
      const serialized = JSON.stringify(value);
      if (ttl > 0) {
        await this.client.set(key, serialized, 'EX', ttl);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (err) {
      this.logger.warn(`Redis SET failed for key "${key}": ${(err as Error).message}. Skipping cache write.`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err) {
      this.logger.warn(`Redis DEL failed for key "${key}": ${(err as Error).message}.`);
    }
  }
}
