import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  emailPhoneUsername: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
