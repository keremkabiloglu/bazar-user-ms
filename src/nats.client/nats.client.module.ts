import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsClientService } from './nats.client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NATS_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: configService.get('NATS_SERVER'),
            headers: {
              'nats-credential': configService.get('NATS_CREDENTIAL'),
            },
          },
        }),
        inject: [ConfigService],
        imports: [ConfigModule],
      },
    ]),
  ],
  providers: [NatsClientService],
  exports: [NatsClientService],
})
export class NatsClientModule {}
