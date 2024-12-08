import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ProducerService } from './core/modules/kafka/producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly producerService: ProducerService,
  ) {}

  @Get()
  getHello(): string {
    this.producerService.produce('order', { value: 'ccc' });
    return this.appService.getHello();
  }
}
