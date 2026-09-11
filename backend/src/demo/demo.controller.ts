import { Controller, Get, Query } from '@nestjs/common';
import { DemoDesignService } from './demo-design.service';
import { DemoModelService } from './demo-model.service';

@Controller('demo')
export class DemoController {
  constructor(
    private readonly demoDesignService: DemoDesignService,
    private readonly demoModelService: DemoModelService,
  ) {}

  @Get('design')
  async getDesign(@Query('prompt') prompt?: string) {
    return this.demoDesignService.getDesign(prompt);
  }

  @Get('model')
  async getModel(@Query('name') name?: string) {
    return this.demoModelService.getModel(name);
  }
}
