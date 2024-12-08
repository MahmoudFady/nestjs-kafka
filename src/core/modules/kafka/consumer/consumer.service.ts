import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConsumer, KafkaConsumerOptions } from '../types/consumer.type';
import { KafkaConsumer } from './kafka.consumer';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];

  constructor(private readonly configService: ConfigService) {}

  async consume(
    { topic, config, onMessage }: KafkaConsumerOptions,
    retries?: number,
  ) {
    const consumer = new KafkaConsumer(
      topic,
      this.configService.get('kafka.brokers'),
      this.configService.get('kafka.clientId'),
      config,
    );
    await consumer.connect();
    await consumer.consume(onMessage, retries);
    this.consumers.push(consumer);
  }

  onApplicationShutdown() {
    for (const consumer of this.consumers) {
      consumer.disconnect();
    }
  }
}
