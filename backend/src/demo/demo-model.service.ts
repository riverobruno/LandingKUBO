import { Injectable } from '@nestjs/common';

@Injectable()
export class DemoModelService {
  getModel(_name?: string) {
    return {
      glbUrl: '/ropero-propuesta.glb',
      budget: {
        amount: 385000,
        currency: 'ARS',
      },
    };
  }
}
