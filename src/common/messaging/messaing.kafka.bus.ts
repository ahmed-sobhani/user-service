import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException
} from '@nestjs/common';
import { Bus, BusOptionsArgument } from './messaging.bus';
import { KafkaClientProxy } from './kafka.client.proxy';
import { ExceptionStatus, IExceptionResponse } from './messaging.types';
import { REQUEST } from '@nestjs/core';
import { RequestContext } from '../dto/result.dto';

@Injectable({ scope: Scope.REQUEST })
export class KafkaBus implements Bus {
  constructor(private kafkaClientProxy: KafkaClientProxy,
              @Inject(REQUEST) private request: RequestContext) {}

  publish<TRequest>(pattern: string, message: TRequest): void {
    this.kafkaClientProxy.client.emit(pattern, message).subscribe(() => {});
  }

  async send<TRequest, TResult>(pattern: string, message: TRequest, options?: BusOptionsArgument): Promise<TResult> {
    try {
      const batch = { value: message };
      this.resolveHeaders(batch, options);

      return await this.kafkaClientProxy.client.send<TResult>(pattern, batch).toPromise();
    } catch (e) {
      throw KafkaBus.handleException(e);
    }
  }

  private resolveHeaders(batch: any, options?: BusOptionsArgument): void {
    if (options?.headers) {
      batch.headers = {
        ...options.headers,
        ...batch.headers
      };
      return;
    }
  }

  private static handleException(exception: IExceptionResponse): any {
    switch (exception.status) {
      case ExceptionStatus.BAD_REQUEST:
        return new BadRequestException(exception.message);
      case ExceptionStatus.NOT_FOUND:
        return new NotFoundException();
      case ExceptionStatus.UNAUTHORIZED:
        return new UnauthorizedException(exception.message);
      case ExceptionStatus.FORBIDDEN:
        return new ForbiddenException(exception.message);
      default:
        return new Error(Array.isArray(exception.message)
          ? exception.message.join(';')
          : exception.message);
    }
  }
}
