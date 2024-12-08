import { Module } from '@nestjs/common';
import { OrderConsumer } from './order.consumer.service';

@Module({
  providers: [OrderConsumer],
})
export class ConsumersModule {}
