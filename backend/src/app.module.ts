import { Module } from '@nestjs/common';
import { DemoModule } from './demo/demo.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [DemoModule, HealthModule],
})
export class AppModule {}
