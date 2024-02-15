import { SetMetadata } from '@nestjs/common';
import { Permission } from 'src/role/enums/permission.enum';

export const PERMISSONS_KEY = 'permissions';
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSONS_KEY, permissions);
