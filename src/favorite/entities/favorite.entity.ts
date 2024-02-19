import { User } from 'src/user/entities/user.entity';
import { DefaultEntity } from 'src/util/default.e';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Favorite extends DefaultEntity {
  @ManyToOne(() => User, (user) => user.favorites, { nullable: false })
  user: User;

  @Column({ type: 'int4', nullable: false })
  advertId: number;

  @Column({ type: 'float', default: 0, nullable: false })
  createdAdvertPrice: number;
}
