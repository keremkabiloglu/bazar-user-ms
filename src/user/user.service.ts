import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneratedJWT } from '../util/model/generated.jwt';
import { JWTPayload } from '../util/model/jwt.payload';
import { RegisterRequestDto } from './dtos/register.request.dto';
import { UpdateInformationRequestDto } from './dtos/update.information.request.dto';
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

  async getById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: id },
    });
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

  async updateInformation(
    userId: number,
    updateInformationRequestDto: UpdateInformationRequestDto,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (user) {
      if (updateInformationRequestDto.name && user.firstName.length == 0) {
        user.firstName = this._upperCaseFirstLetters(
          updateInformationRequestDto.name,
        );
      }
      if (updateInformationRequestDto.surname && user.lastName.length == 0) {
        user.lastName = this._upperCaseFirstLetters(
          updateInformationRequestDto.surname,
        );
      }
      if (updateInformationRequestDto.username) {
        const usernameExist = await this.userRepository.findOne({
          where: { username: updateInformationRequestDto.username },
        });
        if (usernameExist && usernameExist.id != user.id) {
          throw new HttpException('USERNAME_ALREADY_USED', HttpStatus.CONFLICT);
        }
        user.username = updateInformationRequestDto.username;
      }
      if (updateInformationRequestDto.email) {
        const emailExist = await this.userRepository.findOne({
          where: { email: updateInformationRequestDto.email },
        });
        if (emailExist && emailExist.id != user.id) {
          throw new HttpException('EMAIL_ALREADY_USED', HttpStatus.CONFLICT);
        }
        user.email = updateInformationRequestDto.email;
      }
      if (updateInformationRequestDto.phone) {
        const phoneExist = await this.userRepository.findOne({
          where: { phoneNumber: updateInformationRequestDto.phone },
        });
        if (phoneExist && phoneExist.id != user.id) {
          throw new HttpException('PHONE_ALREADY_USED', HttpStatus.CONFLICT);
        }
        user.phoneNumber = updateInformationRequestDto.phone;
      }
      if (updateInformationRequestDto.password) {
        user.password = updateInformationRequestDto.password;
      }
      if (updateInformationRequestDto.gender) {
        user.gender = updateInformationRequestDto.gender;
      }
      if (updateInformationRequestDto.birthDate) {
        const isOverEighteen =
          new Date(updateInformationRequestDto.birthDate).getTime() <
          new Date().getTime() - 567993600000;
        if (!isOverEighteen) {
          throw new HttpException(
            'BIRTH_DATE_MUST_BE_OVER_EIGHTEEN',
            HttpStatus.BAD_REQUEST,
          );
        }
        user.birthDate = updateInformationRequestDto.birthDate;
      }
      const updatedUser = await this.userRepository.save(user);
      return { id: updatedUser.id };
    } else {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
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

  _upperCaseFirstLetters(str: string) {
    return str
      .split(' ')
      .map((n) => n[0].toUpperCase() + n.slice(1))
      .join(' ');
  }
}
