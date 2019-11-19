export class Choice {
  static parse(obj: any) {
    return new Choice(
      obj.key,
      obj.value,
    );
  }

  constructor(
    public key: number,
    public value: string
  ) { }

  getError(): ChoiceError {
    return null;
  }
}

export class ChoiceError extends Choice {
  constructor(
    public non_field_errors?: string[],
    public _text?: string[]
  ) {
    super(null, null);
  }

  getError(): ChoiceError {
    return this;
  }
}
