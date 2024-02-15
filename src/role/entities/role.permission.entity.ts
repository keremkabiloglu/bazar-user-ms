import { DefaultEntity } from 'src/util/default.e';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Permission } from '../enums/permission.enum';
import { Role } from './role.entity';

@Entity()
export class RolePermission extends DefaultEntity {
  @Column({
    default: '',
    nullable: false,
    type: 'text',
  })
  entity: string;

  @Column({
    type: 'enum',
    enum: Permission,
    default: [],
    nullable: false,
    array: true,
  })
  permissions: Permission[];

  @ManyToOne(() => Role, (role) => role.rolePermissions)
  role: Role;
}
