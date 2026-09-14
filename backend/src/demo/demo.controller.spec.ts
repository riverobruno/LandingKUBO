import 'reflect-metadata';
import { describe, it, before, after } from 'node:test';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { getNodeName } from '../node-name';
import { RedisService } from '../redis/redis.service';

describe('DemoController', () => {
  let app: INestApplication;

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const redisService = app.get(RedisService);
    await redisService.del('demo:design:default');
    await redisService.del('demo:model:default');
    await redisService.del('demo:design:escritorio');
  });

  after(async () => {
    await app?.close();
  });

  it('should return the demo design on GET /demo/design', async () => {
    await request(app.getHttpServer())
      .get('/demo/design')
      .expect(200)
      .expect('X-Backend-Node', getNodeName())
      .expect(({ body }) => {
        if (body.name !== 'Placard' || body.measurements.length !== 3) {
          throw new Error('Unexpected demo design response');
        }
      });
  });

  it('should expose an independent health endpoint', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        if (body.status !== 'ok' || typeof body.nodeName !== 'string') {
          throw new Error('Unexpected health response');
        }
      });
  });

  it('should return the demo model on GET /demo/model', async () => {
    await request(app.getHttpServer())
      .get('/demo/model')
      .expect(200)
      .expect(({ body }) => {
        if (body.glbUrl !== '/ropero-propuesta.glb' || body.budget?.currency !== 'ARS') {
          throw new Error('Unexpected demo model response');
        }
      });
  });

  it('should cache and return responses on subsequent reads', async () => {
    const res1 = await request(app.getHttpServer())
      .get('/demo/design?prompt=escritorio')
      .expect(200);

    const res2 = await request(app.getHttpServer())
      .get('/demo/design?prompt=escritorio')
      .expect(200);

    if (res1.body.name !== res2.body.name) {
      throw new Error('Cached response mismatch');
    }

    const model1 = await request(app.getHttpServer())
      .get('/demo/model?name=placard')
      .expect(200);

    const model2 = await request(app.getHttpServer())
      .get('/demo/model?name=placard')
      .expect(200);

    if (model1.body.glbUrl !== model2.body.glbUrl) {
      throw new Error('Cached model response mismatch');
    }
  });
});
