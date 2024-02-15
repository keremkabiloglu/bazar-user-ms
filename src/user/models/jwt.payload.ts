import { Permission } from 'src/role/enums/permission.enum';

export interface JWTPayload {
  id: number;
  email: string;
  role: string;
  permissions: { [entity: string]: Permission[] }[];
}
