import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AddressModule } from './address/address.module';
import { FavoriteModule } from './favorite/favorite.module';
import { FollowerModule } from './follower/follower.module';
import { BlockModule } from './block/block.module';
import { DeviceModule } from './device/device.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        synchronize:
          configService.get<string>('ENVIRONMENT') === 'development'
            ? true
            : false,
        entities:
          configService.get<string>('ENVIRONMENT') === 'development'
            ? ['dist/**/*.entity{.ts,.js}']
            : [__dirname + '/../**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      privateKey: process.env.JWT_PRIVATE_KEY,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRE}s` },
    }),
    UserModule,
    RoleModule,
    AddressModule,
    FavoriteModule,
    FollowerModule,
    BlockModule,
    DeviceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
