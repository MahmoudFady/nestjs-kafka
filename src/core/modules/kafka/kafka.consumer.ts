import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaMessage,
} from 'kafkajs';
import { IConsumer } from './types/consumer.type';

export class KafkaConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private retries = 5;

  constructor(
    private readonly topic: ConsumerSubscribeTopics,
    brokers: string[],
    config: ConsumerConfig,
    clientId: string,
  ) {
    this.kafka = new Kafka({ brokers, clientId });
    this.consumer = this.kafka.consumer(config);
  }
  async consume(
    onMessage: (message: KafkaMessage) => Promise<void>,
  ): Promise<void> {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        try {
          return await onMessage(message);
        } catch (e) {
          if (this.retries == 0) {
            return;
            // move to dlq queue
          }
          this.retries -= 1;
          return await this.consume(onMessage);
        }
      },
    });
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
    } catch (e) {
      this.connect();
    }
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }
}
