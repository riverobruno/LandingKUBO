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

  it('should return HTTP 200 on GET /demo/design', async () => {
    await request(app.getHttpServer())
      .get('/demo/design')
      .expect(200);
  });
});
