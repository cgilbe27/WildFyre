export class Auth {
  static parse(obj: any) {
    return new Auth(obj.token);
  }

  constructor(
    public token: string
  ) { }

  getError(): AuthError {
    return null;
  }
}

export class AuthError extends Auth {
  constructor(
    public non_field_errors?: string[],
    public detail?: string,
    public username?: string[],
    public password?: string[]
  ) { super(null); }

  getError(): AuthError {
    return this;
  }
}
