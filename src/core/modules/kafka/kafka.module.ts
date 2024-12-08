import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsumerService } from './consumer/consumer.service';
import { ProducerService } from './producer/producer.service';
@Global()
@Module({
  providers: [ConfigService, ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
