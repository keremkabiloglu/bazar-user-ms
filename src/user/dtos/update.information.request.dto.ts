import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class UpdateInformationRequestDto {
  @IsOptional()
  @Matches(/^[a-zA-ZçğıöşüÇĞİÖŞÜ]{2,32}(?: [a-zA-ZçğıöşüÇĞİÖŞÜ]+)?$/)
  name: string;

  @IsOptional()
  @Matches(/^[a-zA-ZçğıöşüÇĞİÖŞÜ]{2,32}$/)
  surname: string;

  @IsOptional()
  @Matches(/^[a-z0-9.]+$/)
  @MinLength(4)
  @MaxLength(32)
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber('TR')
  phone: string;

  @IsOptional()
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,32}$/)
  password: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsDateString()
  birthDate: Date;
}
