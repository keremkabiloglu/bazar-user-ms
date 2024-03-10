import { IsInt } from 'class-validator';

export class NatsGetByIdDto {
  @IsInt()
  id: number;
}
