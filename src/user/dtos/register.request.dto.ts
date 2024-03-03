import {
  IsBoolean,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export class RegisterRequestDto {
  @Matches(/^[a-zA-ZçğıöşüÇĞİÖŞÜ]{2,}(?: [a-zA-ZçğıöşüÇĞİÖŞÜ]+)?$/)
  name: string;

  @Matches(/^[a-zA-ZçğıöşüÇĞİÖŞÜ]{2,}$/)
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsPhoneNumber('TR')
  phoneNumber: string;

  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,32}$/)
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  campaignConfirmed: boolean;
}
