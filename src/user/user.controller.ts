import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { Request as Req, Response as Res } from 'express';

import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { Public } from 'src/decorators/public.decorator';
import { NatsGetByIdDto } from 'src/nats.client/dto/nats.get.by.id.dto';
import { LoginRequestDto } from './dtos/login.request.dto';
import { RegisterRequestDto } from './dtos/register.request.dto';
import { UpdateInformationRequestDto } from './dtos/update.information.request.dto';
import { UserService } from './user.service';

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
      loginRequestDto.emailPhoneUsername,
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
    const cookies = request.headers?.cookie?.split('; ');
    const refreshToken = cookies
      ?.find((cookie) => cookie.startsWith('Refresh'))
      ?.split('=')[1];
    if (refreshToken) {
      const authanticated = await this.userService.refresh(
        refreshToken.replaceAll('Bearer%20', ''),
      );
      if (authanticated) {
        response.status(HttpStatus.CREATED);
        response.cookie('Authentication', `Bearer ${authanticated.jwt.token}`, {
          expires: authanticated.jwt.expires,
        });
        response.cookie('Refresh', `Bearer ${authanticated.refresh.token}`, {
          expires: authanticated.refresh.expires,
        });
        response.send(authanticated.user);

        return authanticated.user;
      }
    } else {
      throw new HttpException('MISSING_REFRESH_TOKEN', HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Post('register')
  async register(
    @Body() registerRequestDto: RegisterRequestDto,
    @Response() response: Res,
  ): Promise<any> {
    const authanticated = await this.userService.register(registerRequestDto);

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

  @MessagePattern('user.getById', Transport.NATS)
  async getUserByNats(@Payload() data: NatsGetByIdDto): Promise<any> {
    return await this.userService.getById(data.id);
  }

  @Patch('u/updateInformation')
  async updateInformation(
    @Body() updateInformationRequestDto: UpdateInformationRequestDto,
    @Request() request: any,
  ) {
    return await this.userService.updateInformation(
      request.user.id,
      updateInformationRequestDto,
    );
  }
}
