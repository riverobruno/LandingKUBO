import 'reflect-metadata';
import { describe, it, before, after } from 'node:test';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';

describe('DemoController', () => {
  let app: INestApplication;

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  after(async () => {
    await app?.close();
  });

  it('should return the demo design on GET /demo/design', async () => {
    await request(app.getHttpServer())
      .get('/demo/design')
      .expect(200)
      .expect(({ body }) => {
        if (body.name !== 'Placard' || body.measurements.length !== 3) {
          throw new Error('Unexpected demo design response');
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
});
