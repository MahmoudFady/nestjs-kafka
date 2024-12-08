import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { IProducer } from './types/producer.type';
import { ConfigService } from '@nestjs/config';
import { KafkaProducer } from './kafka.producer';
import { Message } from 'kafkajs';
import { TopicNames } from './types/topic-names.enum';

@Injectable()
export class ProducerService implements OnApplicationShutdown {
  private readonly producers = new Map<string, IProducer>();
  constructor(private readonly configService: ConfigService) {}

  async produce(topic: TopicNames, message: Message) {
    const producer = await this.getProducer(topic);
    await producer.produce(message);
  }

  private async getProducer(topic: TopicNames): Promise<IProducer> {
    let producer = this.producers.get(topic);
    if (!producer) {
      producer = new KafkaProducer(
        topic,
        this.configService.get('kafka.brokers'),
        this.configService.get('kafka.clientId'),
      );
      await producer.connect();
      this.producers.set(topic, producer);
    }
    return producer;
  }
  onApplicationShutdown() {
    const producers = this.producers.values();
    for (const producer of producers) {
      producer.disconnect();
    }
  }
}
