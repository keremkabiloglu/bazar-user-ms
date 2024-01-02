export class JWTPayload {
  id: number;
  email: string;

  constructor(opts: Required<JWTPayload>) {
    Object.assign(this, opts);
  }
}
