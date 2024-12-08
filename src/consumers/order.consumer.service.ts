import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/core/modules/kafka/consumer.service';

@Injectable()
export class OrderConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}
  onModuleInit() {
    this.consumerService.consume({
      topic: { topics: ['order'] },
      config: { groupId: '1' },
      onMessage: async (message) => {
        console.log(message.toString());
      },
    });
  }
}
