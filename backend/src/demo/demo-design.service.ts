import { Injectable } from '@nestjs/common';

@Injectable()
export class DemoDesignService {
  getDesign(_prompt?: string) {
    return {
      name: 'Placard',
      sketchImage: '/placard-sketch.svg',
      measurements: [
        { label: 'Ancho', value: 120, unit: 'cm' },
        { label: 'Alto', value: 200, unit: 'cm' },
        { label: 'Profundidad', value: 55, unit: 'cm' },
      ],
    };
  }
}
