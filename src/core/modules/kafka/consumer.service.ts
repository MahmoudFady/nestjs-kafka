import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { IConsumer, KafkaConsumerOptions } from './types/consumer.type';
import { KafkaConsumer } from './kafka.consumer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];

  constructor(private readonly configService: ConfigService) {}

  async consume({ topic, config, onMessage }: KafkaConsumerOptions) {
    const consumer = new KafkaConsumer(
      topic,
      this.configService.get('kafka.brokers'),
      config,
      this.configService.get('kafka.clientId'),
    );
    await consumer.connect();
    await consumer.consume(onMessage);
    this.consumers.push(consumer);
    console.log(topic.topics, 'listening');
  }

  onApplicationShutdown() {
    for (const consumer of this.consumers) {
      consumer.disconnect();
    }
  }
}
