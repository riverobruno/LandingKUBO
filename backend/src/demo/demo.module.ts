import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { DemoDesignService } from './demo-design.service';
import { DemoModelService } from './demo-model.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [DemoController],
  providers: [DemoDesignService, DemoModelService],
})
export class DemoModule {}
