import 'reflect-metadata';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  it('should return null on cache miss', async () => {
    const mockClient = {
      status: 'ready',
      get: async () => null,
      set: async () => 'OK',
      del: async () => 1,
      on: () => mockClient,
      disconnect: () => {},
    };

    const service = new RedisService(mockClient as any);
    const result = await service.get('non-existent-key');
    assert.strictEqual(result, null);
  });

  it('should return parsed data on cache hit', async () => {
    const cachedData = { name: 'Placard', measurements: [{ label: 'Ancho', value: 120, unit: 'cm' }] };
    const mockClient = {
      status: 'ready',
      get: async (key: string) => {
        if (key === 'demo:design:placard') {
          return JSON.stringify(cachedData);
        }
        return null;
      },
      set: async () => 'OK',
      del: async () => 1,
      on: () => mockClient,
      disconnect: () => {},
    };

    const service = new RedisService(mockClient as any);
    const result = await service.get('demo:design:placard');
    assert.deepStrictEqual(result, cachedData);
  });

  it('should store serialized data with TTL on set', async () => {
    let capturedArgs: any[] = [];
    const mockClient = {
      status: 'ready',
      get: async () => null,
      set: async (...args: any[]) => {
        capturedArgs = args;
        return 'OK';
      },
      del: async () => 1,
      on: () => mockClient,
      disconnect: () => {},
    };

    const service = new RedisService(mockClient as any);
    await service.set('test:key', { foo: 'bar' }, 60);

    assert.strictEqual(capturedArgs[0], 'test:key');
    assert.strictEqual(capturedArgs[1], JSON.stringify({ foo: 'bar' }));
    assert.strictEqual(capturedArgs[2], 'EX');
    assert.strictEqual(capturedArgs[3], 60);
  });

  it('should gracefully fallback to null when Redis get fails', async () => {
    const mockClient = {
      status: 'ready',
      get: async () => {
        throw new Error('Connection refused');
      },
      set: async () => 'OK',
      del: async () => 1,
      on: () => mockClient,
      disconnect: () => {},
    };

    const service = new RedisService(mockClient as any);
    const result = await service.get('failing:key');
    assert.strictEqual(result, null);
  });

  it('should gracefully handle Redis set failure without throwing', async () => {
    const mockClient = {
      status: 'ready',
      get: async () => null,
      set: async () => {
        throw new Error('OOM command not allowed');
      },
      del: async () => 1,
      on: () => mockClient,
      disconnect: () => {},
    };

    const service = new RedisService(mockClient as any);
    await assert.doesNotReject(async () => {
      await service.set('failing:key', { data: 123 });
    });
  });

  it('should invalidate cache entry via del', async () => {
    let deletedKey = '';
    const mockClient = {
      status: 'ready',
      get: async () => null,
      set: async () => 'OK',
      del: async (key: string) => {
        deletedKey = key;
        return 1;
      },
      on: () => mockClient,
      disconnect: () => {},
    };

    const service = new RedisService(mockClient as any);
    await service.del('demo:design:placard');
    assert.strictEqual(deletedKey, 'demo:design:placard');
  });

  it('should handle onModuleInit connection failure gracefully', async () => {
    const mockClient = {
      status: 'wait',
      connect: async () => {
        throw new Error('Connect timeout');
      },
      on: () => mockClient,
      disconnect: () => {},
    };

    const service = new RedisService(mockClient as any);
    await assert.doesNotReject(async () => {
      await service.onModuleInit();
    });
  });

  it('should disconnect on onModuleDestroy', async () => {
    let disconnected = false;
    const mockClient = {
      status: 'ready',
      disconnect: () => {
        disconnected = true;
      },
      on: () => mockClient,
    };

    const service = new RedisService(mockClient as any);
    await service.onModuleDestroy();
    assert.strictEqual(disconnected, true);
  });
});
