import { HttpException } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

// Sends a message to a service and turns its error into the matching HTTP error.
export async function send<T>(client: ClientProxy, pattern: string, data: unknown = {}) {
  try {
    return await firstValueFrom(client.send<T>(pattern, data));
  } catch (error) {
    const { statusCode, message } = (error ?? {}) as { statusCode?: number; message?: string };
    if (statusCode) throw new HttpException(message ?? 'Error', statusCode);
    throw error;
  }
}
