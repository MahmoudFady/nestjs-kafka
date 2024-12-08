import { ConsumerSubscribeTopics, ConsumerConfig, KafkaMessage } from 'kafkajs';
import { TopicNames } from './topic-names.enum';

export interface IConsumer {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  consume: (message: any) => Promise<void>;
}
export interface KafkaConsumerOptions {
  topic: ConsumerSubscribeTopics;
  config: ConsumerConfig;
  onMessage: (message: KafkaMessage) => Promise<void>;
}
