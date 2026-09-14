import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { getNodeName } from './node-name';

@Controller()
export class HealthController {
  @Get('health')
  getHealth() {
    return { status: 'ok', nodeName: getNodeName() };
  }

  @Get('health/ok')
  getHealthOk() {
    return { status: 'ok', nodeName: getNodeName() };
  }

  @Post('sobrecargar')
  @HttpCode(HttpStatus.OK)
  sobrecargar(@Res({ passthrough: true }) res: Response) {
    res.once('finish', () => {
      setImmediate(() => {
        process.exit(0);
      });
    });
    return { status: 'overloaded', nodeName: getNodeName() };
  }
}
