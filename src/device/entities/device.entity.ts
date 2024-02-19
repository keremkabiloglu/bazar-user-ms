import { DefaultEntity } from 'src/util/default.e';
import { Column, Entity } from 'typeorm';

@Entity()
export class Device extends DefaultEntity {
  @Column({ type: 'int4', nullable: false })
  userId: number;

  @Column({ type: 'text', default: '', nullable: false })
  name: string;

  @Column({ type: 'text', default: '', nullable: false })
  ip: string;

  @Column({ type: 'int4', nullable: true })
  cityId: string;

  @Column({ type: 'text', nullable: true })
  cityName: string;

  @Column({ type: 'text', nullable: true })
  notificationToken: string;

  @Column({ type: 'timestamp', nullable: true })
  lastActivityAt: Date;
}
