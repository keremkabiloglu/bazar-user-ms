import { CrudConfigService } from '@dataui/crud';
import { Permissions } from './decorators/permission.decorator';
import { Permission } from './util/enum/permission.enum';

CrudConfigService.load({
  routes: {
    only: [
      'getManyBase',
      'getOneBase',
      'createOneBase',
      'updateOneBase',
      'deleteOneBase',
    ],
    getManyBase: {
      interceptors: [],
      decorators: [Permissions(Permission.READ)],
    },
    getOneBase: {
      interceptors: [],
      decorators: [Permissions(Permission.READ)],
    },
    createOneBase: {
      interceptors: [],
      decorators: [Permissions(Permission.CREATE)],
    },
    updateOneBase: {
      interceptors: [],
      decorators: [Permissions(Permission.UPDATE)],
    },
    deleteOneBase: {
      interceptors: [],
      decorators: [Permissions(Permission.DELETE)],
    },
  },
});

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  if (configService.get('ENVIRONMENT') === 'development') {
    app.setGlobalPrefix('user-service');
  }
  await app.listen(3000);
}
bootstrap();
