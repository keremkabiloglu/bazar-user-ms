import { User } from 'src/user/entities/user.entity';
import { DefaultEntity } from 'src/util/default.e';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AddressType } from '../enums/address.type.enum';

@Entity()
export class Address extends DefaultEntity {
  @Column({ type: 'boolean', default: false, nullable: false })
  isDefault: boolean;

  @ManyToOne(() => User, (user) => user.addresses, { nullable: false })
  user: User;

  @Column({
    type: 'enum',
    enum: AddressType,
    default: AddressType.INDIVIDUAL,
    nullable: false,
  })
  type: AddressType;

  @Column({ type: 'text', default: '', nullable: false })
  header: string;

  @Column({ type: 'text', default: '', nullable: false })
  phone: string;

  @Column({ type: 'int4', nullable: false })
  cityId: number;

  @Column({ type: 'text', default: '', nullable: false })
  cityName: string;

  @Column({ type: 'int4', nullable: false })
  districtId: number;

  @Column({ type: 'text', default: '', nullable: false })
  districtName: string;

  @Column({ type: 'int4', nullable: false })
  villageId: number;

  @Column({ type: 'text', default: '', nullable: false })
  villageName: string;

  @Column({ type: 'text', default: '', nullable: false })
  description: string;

  @Column({ type: 'text', nullable: true })
  taxNumber: string;

  @Column({ type: 'int4', nullable: true })
  taxOfficeId: string;

  @Column({ type: 'text', nullable: true })
  companyName: string;
}
