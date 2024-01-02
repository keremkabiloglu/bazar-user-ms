import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from '../enums/gender.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    default: 'example@example.com',
    nullable: false,
  })
  email: string;

  @Column({
    type: 'text',
    default: '',
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    type: 'text',
    default: '',
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'text',
    default: '',
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: false,
    default: Gender.NOT_ANSWERED,
  })
  gender: Gender;
}
