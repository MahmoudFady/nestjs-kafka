import { Message } from 'kafkajs';
import { TopicNames } from './topic-names.enum';

export interface IProducer {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  produce: (message: Message) => Promise<void>;
}
