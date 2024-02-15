import { User } from 'src/user/entities/user.entity';
import { DefaultEntity } from 'src/util/default.e';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { RolePermission } from './role.permission.entity';

@Entity()
export class Role extends DefaultEntity {
  @Column({
    unique: true,
    default: '',
    nullable: false,
    type: 'text',
  })
  name: string;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];

  @OneToOne(() => User, (user) => user.role)
  user: User;
}
