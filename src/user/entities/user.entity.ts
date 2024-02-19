import { Address } from 'src/address/entities/address.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { Role } from 'src/role/entities/role.entity';
import { DefaultEntity } from 'src/util/default.e';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from '../enums/gender.enum';

@Entity()
export class User extends DefaultEntity {
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

  @OneToOne(() => Role)
  @JoinColumn()
  role: Role;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];
}
