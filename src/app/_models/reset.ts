export class Reset {
  static parse(obj: any) {
    return new Reset();
  }

  getError(): ResetError {
    return null;
  }
}

export class ResetError extends Reset {
  constructor(
    public non_field_errors?: string[],
    public new_password?: string[],
    public token?: string[],
    public transaction?: string[],
    public captcha?: string[]
  ) { super(); }

  getError(): ResetError {
    return this;
  }
}
