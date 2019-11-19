export class Registration {
  static parse(obj: any) {
    return new Registration();
  }

  getError(): RegistrationError {
    return null;
  }
}

export class RegistrationError extends Registration {
  constructor(
    public non_field_errors?: string[],
    public username?: string[],
    public email?: string[],
    public password?: string[],
    public captcha?: string[]
  ) { super(); }

  getError(): RegistrationError {
    return this;
  }
}
