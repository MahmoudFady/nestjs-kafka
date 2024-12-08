import { Kafka, Producer } from 'kafkajs';
import { IProducer } from './types/producer.type';

export class KafkaProducer implements IProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  constructor(
    private readonly topic: string,
    brokers: string[],
    clientId: string,
  ) {
    this.kafka = new Kafka({ brokers, clientId });
    this.producer = this.kafka.producer();
  }
  async produce(message: any): Promise<void> {
    await this.producer.send({
      topic: this.topic,
      messages: [message],
    });
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
    } catch (e) {
      await this.connect();
    }
  }
  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }
}
