export class RecoverTransaction {
  static parse(obj: any) {
    return new RecoverTransaction(
      obj.transaction
    );
  }

  constructor(
    public transaction: string
  ) { }

  getError(): RecoverTransactionError {
    return null;
  }
}

export class RecoverTransactionError extends RecoverTransaction {
  constructor(
    public non_field_errors?: string[],
    public username?: string[],
    public email?: string[],
    public captcha?: string[]
  ) { super(null); }

  getError(): RecoverTransactionError {
    return this;
  }
}
