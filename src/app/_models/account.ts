export class Account {
  static parse(obj: any) {
    return new Account(
      obj.id,
      obj.username,
      obj.email
    );
  }

  constructor(
    public id: number,
    public username?: string | string[],
    public email?: string | string[]
  ) { }

  getError(): AccountError {
    return null;
  }
}

export class AccountError extends Account {
  constructor(
    public non_field_errors?: string[],
    public detail?: string,
    public username?: string[],
    public email?: string[]
  ) {
    super(null, null, null);
  }

  getError(): AccountError {
    return this;
  }
}
