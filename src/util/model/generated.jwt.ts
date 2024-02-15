export class GeneratedJWT {
  token: string;
  expires: Date;

  constructor(opts: Required<GeneratedJWT>) {
    Object.assign(this, opts);
  }
}
