import { IsBoolean, IsNotEmpty, IsPhoneNumber, Matches } from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty()
  @Matches(/^[a-zA-ZçğıöşüÇĞİÖŞÜ]{2,32}(?: [a-zA-ZçğıöşüÇĞİÖŞÜ]+)?$/)
  name: string;

  @IsNotEmpty()
  @Matches(/^[a-zA-ZçğıöşüÇĞİÖŞÜ]{2,32}$/)
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
