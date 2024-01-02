import { User } from '../entities/user.entity';
import { GeneratedJWT } from './generated.jwt';

export class AuthenticatedUser {
  user: User;
  jwt: GeneratedJWT;
  refresh: GeneratedJWT;

  constructor(opts: Required<AuthenticatedUser>) {
    Object.assign(this, opts);
  }
}
