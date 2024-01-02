import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { Request as Req, Response as Res } from 'express';

import { Public } from 'src/decorators/public.decorator';
import { LoginRequestDto } from './dtos/login.request.dto';
import { UserService } from './user.service';
var moment = require('moment-timezone');

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('login')
  async login(
    @Body() loginRequestDto: LoginRequestDto,
    @Response() response: Res,
  ): Promise<void> {
    const authanticated = await this.userService.authenticate(
      loginRequestDto.email,
      loginRequestDto.password,
    );

    if (authanticated) {
      response.status(HttpStatus.OK);
      response.cookie('Authentication', `Bearer ${authanticated.jwt.token}`, {
        expires: authanticated.jwt.expires,
      });
      response.cookie('Refresh', `Bearer ${authanticated.refresh.token}`, {
        expires: authanticated.refresh.expires,
      });
      response.send(authanticated.user);
    }
  }

  @Public()
  @Post('refresh')
  async refresh(@Request() request: Req, @Response() response: Res) {
    const refreshToken = request.headers?.cookie
      ?.split('; ')[1]
      .split('Refresh=')[1]
      ?.split('%20')[1];
    if (refreshToken) {
      const authanticated = await this.userService.refresh(refreshToken);
      if (authanticated) {
        response.status(HttpStatus.CREATED);
        response.cookie('Authentication', `Bearer ${authanticated.jwt.token}`, {
          maxAge: authanticated.jwt.expires.getSeconds() * 1000,
        });
        response.cookie('Refresh', `Bearer ${authanticated.refresh.token}`, {
          maxAge: authanticated.refresh.expires.getSeconds() * 1000,
        });
        response.send(authanticated.user);
      }
    } else {
      throw new HttpException('MISSING_REFRESH_TOKEN', HttpStatus.BAD_REQUEST);
    }
  }
}
