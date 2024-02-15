import { Permission } from 'src/util/enum/permission.enum';

export interface JWTPayload {
  id: number;
  email: string;
  role: string;
  permissions: { [entity: string]: Permission[] }[];
}
