import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneratedJWT } from '../util/model/generated.jwt';
import { JWTPayload } from '../util/model/jwt.payload';
import { RegisterRequestDto } from './dtos/register.request.dto';
import { User } from './entities/user.entity';
import { AuthenticatedUser } from './models/authanticated.user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async authenticate(
    emailPhoneUsername: string,
    password: string,
  ): Promise<AuthenticatedUser> {
    const user = await this.userRepository.findOne({
      where: [
        {
          phoneNumber: emailPhoneUsername.includes('+90')
            ? emailPhoneUsername
            : `+90${emailPhoneUsername}`,
          password: password,
        },
        { username: emailPhoneUsername, password: password },
        { email: emailPhoneUsername, password: password },
      ],
      relations: ['role', 'role.rolePermissions'],
    });
    if (user) {
      const jwtExpireMilliSeconds =
        this.configService.get<number>('JWT_EXPIRE');
      const refreshExpireMilliSeconds =
        this.configService.get<number>('JWT_REFRESH_EXPIRE');
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role.name,
        permissions: user.role.rolePermissions.map((p) => {
          return { [p.entity]: p.permissions };
        }),
      };
      const jwt = await this.generateJwt(payload, jwtExpireMilliSeconds);
      const refresh = await this.generateJwt(
        payload,
        refreshExpireMilliSeconds,
      );
      return new AuthenticatedUser({
        user: user,
        jwt: jwt,
        refresh: refresh,
      });
    } else {
      throw new HttpException(
        'USERNAME_OR_PASSWORD_WRONG',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async register(
    registerRequestDto: RegisterRequestDto,
  ): Promise<AuthenticatedUser> {
    const samePhoneUser = await this.userRepository.findOne({
      where: { phoneNumber: registerRequestDto.phoneNumber },
    });
    if (samePhoneUser === null || samePhoneUser === undefined) {
      let username = `${registerRequestDto.name} ${registerRequestDto.surname}`
        .toLocaleLowerCase()
        .replaceAll('ı', 'i')
        .replaceAll('ğ', 'g')
        .replaceAll('ü', 'u')
        .replaceAll('ş', 's')
        .replaceAll('ö', 'o')
        .replaceAll('ç', 'c')
        .replaceAll(' ', '.');
      let usernameExist = false;
      do {
        const existUserNames = await this.userRepository.query(
          'select "id" from "user" where username = $1',
          [username],
        );
        if (existUserNames.length > 0) {
          usernameExist = true;
          const randomNumber = Math.floor(Math.random() * 1000);
          username = `${username}${randomNumber}`;
        } else {
          usernameExist = false;
        }
      } while (usernameExist);

      const insertedId = await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          phoneNumber: registerRequestDto.phoneNumber.includes('+90')
            ? registerRequestDto.phoneNumber
            : `+90${registerRequestDto.phoneNumber}`,
          username: username,
          password: registerRequestDto.password,
          firstName: this._upperCaseFirstLetters(registerRequestDto.name),
          lastName: this._upperCaseFirstLetters(registerRequestDto.surname),
          role: { id: 1 },
        })
        .returning(['id'])
        .execute();
      if (insertedId) {
        return await this.authenticate(
          registerRequestDto.phoneNumber,
          registerRequestDto.password,
        );
      }
    } else {
      throw new HttpException('PHONE_NUMBER_ALREADY_USED', HttpStatus.CONFLICT);
    }
  }

  _upperCaseFirstLetters(str: string) {
    return str
      .split(' ')
      .map((n) => n[0].toUpperCase() + n.slice(1))
      .join(' ');
  }

  async refresh(refreshToken: string): Promise<AuthenticatedUser> {
    try {
      const verified = await this.jwtService.verifyAsync(refreshToken);
      if (verified) {
        const jwtExpireMilliSeconds =
          this.configService.get<number>('JWT_EXPIRE');
        const refreshExpireMilliSeconds =
          this.configService.get<number>('JWT_REFRESH_EXPIRE');
        const payload = {
          id: verified.id,
          email: verified.email,
          role: verified.role.name,
          permissions: verified.role.permissions.map((p) => {
            return { [p.entity]: p.permissions };
          }),
        };
        const jwt = await this.generateJwt(payload, jwtExpireMilliSeconds);
        const refresh = await this.generateJwt(
          payload,
          refreshExpireMilliSeconds,
        );
        const user = await this.userRepository.findOne({
          where: { id: verified.id },
        });
        if (user) {
          return new AuthenticatedUser({
            user: user,
            jwt: jwt,
            refresh: refresh,
          });
        } else {
          throw new HttpException(
            'USER_NOT_FOUND',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    } catch (error) {
      throw new HttpException('REFRESH_TOKEN_INVALID', HttpStatus.FORBIDDEN);
    }
  }

  private async generateJwt(
    payload: JWTPayload,
    expireSeconds: number,
  ): Promise<GeneratedJWT> {
    try {
      const token = await this.jwtService.signAsync(
        JSON.parse(JSON.stringify(payload)),
        { expiresIn: expireSeconds * 100 },
      );
      return new GeneratedJWT({
        token: token,
        expires: new Date(Date.now() + expireSeconds * 1000),
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        'JWT_COULD_NOT_GENERATED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
