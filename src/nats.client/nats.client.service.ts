import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError } from 'rxjs';

export class NatsClientService {
  constructor(@Inject('NATS_SERVICE') private client: ClientProxy) {}

  async send(pattern: string, data: any): Promise<any> {
    return new Promise(async (resolve) => {
      try {
        Logger.log(
          `Sending data to NATS server... (pattern: ${pattern})`,
          this.constructor.name,
        );
        this.client
          .send(pattern, data)
          .pipe(
            catchError(
              (error) => new Observable((observer) => observer.error(error)),
            ),
          )
          .subscribe((result) => {
            console.log(result);

            resolve(result);
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
