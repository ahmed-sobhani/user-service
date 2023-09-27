import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MESSAGE_CLIENT } from './messaging.constants';

@Injectable()
export class KafkaClientProxy implements OnModuleInit {
  constructor(@Inject(MESSAGE_CLIENT) public client: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }
}
