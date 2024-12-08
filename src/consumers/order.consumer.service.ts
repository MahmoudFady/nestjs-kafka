import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/core/modules/kafka/consumer.service';
import { TopicNames } from 'src/core/modules/kafka/types/topic-names.enum';

@Injectable()
export class OrderConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}
  onModuleInit() {
    this.consumerService.consume({
      topic: { topics: [TopicNames.ORDER] },
      config: { groupId: '1' },
      onMessage: async (message) => {
        console.log('recived xxx : ', message.value.toString());
      },
    });
  }
}
