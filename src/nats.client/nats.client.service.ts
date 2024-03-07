import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export class NatsClientService {
  constructor(@Inject('NATS_SERVICE') private client: ClientProxy) {}

  async send(pattern: string, data: any): Promise<any> {
    return new Promise(async (resolve) => {
      try {
        Logger.log(
          `Sending data to NATS server... (pattern: ${pattern} data: ${data})`,
          this.constructor.name,
        );
        this.client.send(pattern, data).subscribe((response) => {
          Logger.log('Data received from NATS server', this.constructor.name);
          resolve(response);
        });
      } catch (error) {
        Logger.log(
          'Error sending data to NATS server: ' + error,
          this.constructor.name,
        );
        resolve(undefined);
      }
    });
  }
}
