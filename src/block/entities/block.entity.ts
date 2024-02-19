import { DefaultEntity } from 'src/util/default.e';
import { Column, Entity } from 'typeorm';

@Entity()
export class Block extends DefaultEntity {
  @Column({ type: 'int4', nullable: false })
  blockerUserId: number;

  @Column({ type: 'int4', nullable: false })
  blockedUserId: number;
}
