import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaMessage,
} from 'kafkajs';
import { IConsumer } from '../types/consumer.type';

export class KafkaConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private retries = 5;

  constructor(
    private readonly topic: ConsumerSubscribeTopics,
    brokers: string[],
    clientId: string,
    config: ConsumerConfig,
  ) {
    this.kafka = new Kafka({ brokers, clientId });
    this.consumer = this.kafka.consumer(config);
  }
  async consume(
    onMessage: (message: KafkaMessage) => Promise<void>,
    retries?: number,
  ): Promise<void> {
    retries = retries || this.retries;
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        while (retries > 0) {
          try {
            await onMessage(message);
            return;
          } catch (e) {
            retries -= 1;
            if (retries == 0) {
              console.log('moving to dl queue');
              return;
            }
          }
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
