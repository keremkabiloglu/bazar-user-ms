import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: true,
    default: null,
    onUpdate: 'now()',
  })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, default: null })
  deletedAt?: Date;
}
