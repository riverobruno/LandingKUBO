import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { BackendNodeHeaderInterceptor } from './backend-node-header.interceptor';
import { DemoModule } from './demo/demo.module';
import { HealthController } from './health.controller';

@Module({
  imports: [DemoModule],
  controllers: [HealthController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: BackendNodeHeaderInterceptor }],
})
export class AppModule {}
