import { SetMetadata } from '@nestjs/common';
import { Permission } from 'src/util/enum/permission.enum';

export const PERMISSONS_KEY = 'permissions';
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSONS_KEY, permissions);
