import { DefaultEntity } from 'src/util/default.e';
import { Column, Entity } from 'typeorm';

@Entity()
export class Follower extends DefaultEntity {
  @Column({ type: 'int4', nullable: false })
  followerUserId: number;

  @Column({ type: 'int4', nullable: false })
  followedUserId: number;
}
