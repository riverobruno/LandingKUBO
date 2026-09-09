import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { DemoDesignService } from './demo-design.service';
import { DemoModelService } from './demo-model.service';

@Module({
  controllers: [DemoController],
  providers: [DemoDesignService, DemoModelService],
})
export class DemoModule {}
