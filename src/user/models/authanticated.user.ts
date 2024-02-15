import { GeneratedJWT } from '../../util/model/generated.jwt';
import { User } from '../entities/user.entity';

export class AuthenticatedUser {
  user: User;
  jwt: GeneratedJWT;
  refresh: GeneratedJWT;

  constructor(opts: Required<AuthenticatedUser>) {
    Object.assign(this, opts);
  }
}
