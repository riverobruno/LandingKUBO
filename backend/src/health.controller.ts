import { Controller, Get } from '@nestjs/common';
import { getNodeName } from './node-name';

@Controller()
export class HealthController {
  @Get('health')
  getHealth() {
    return { status: 'ok', nodeName: getNodeName() };
  }
}
