import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TopicNames } from './core/modules/kafka/types/topic-names.enum';
import { ProducerService } from './core/modules/kafka/producer/producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly producerService: ProducerService,
  ) {}

  @Get()
  getHello(): string {
    this.producerService.produce(TopicNames.ORDER, {
      value: 'testing value passed from producer to consumer',
      key: 'key defination',
    });
    return this.appService.getHello();
  }
}
