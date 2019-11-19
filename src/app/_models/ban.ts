export class Ban {
  static parse(obj: any) {
    return new Ban(
      String(new Date(obj.timestamp)),
      obj.reason,
      obj.comment,
      String(new Date(obj.expiry)),
      obj.auto,
      obj.ban_all,
      obj.ban_post,
      obj.ban_comment,
      obj.ban_flag
    );
  }

  constructor(
    public timestamp: string,
    public reason: number,
    public comment: string,
    public expiry: string,
    public auto: boolean,
    public ban_all: boolean,
    public ban_post: boolean,
    public ban_comment: boolean,
    public ban_flag: boolean,
  ) { }

  getError(): BanError {
    return null;
  }
}

export class BanError extends Ban {
  constructor(
    public non_field_errors?: string[],
    public _text?: string[]
  ) {
    super(null, null, null, null, null, null, null, null, null);
  }

  getError(): BanError {
    return this;
  }
}
