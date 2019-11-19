export class Auth {
  static parse(obj: any) {
    return new Auth();
  }

  getError(): AuthError {
    return null;
  }
}

export class AuthError extends Auth {
  constructor(
    public non_field_errors?: string[],
    public _username?: string[],
    public _password?: string[]
  ) { super(); }

  getError(): AuthError {
    return this;
  }
}
