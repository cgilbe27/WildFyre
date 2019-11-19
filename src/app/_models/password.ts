export class Password {
  static parse(obj: any) {
    return new Password();
  }

  getError(): PasswordError {
    return null;
  }
}

export class PasswordError extends Password {
  constructor(
    public non_field_errors?: string[],
    public _text?: string[],
    public _oldPassword?: string[],
    public _newPassword1?: string[],
    public _newPassword2?: string[]
  ) { super(); }

  getError(): PasswordError {
    return this;
  }
}
