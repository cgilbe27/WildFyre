export class Ban {
  public expiry: Date;
  public timestamp: Date;

  static parse(obj: any) {
    return new Ban(
      obj.timestamp,
      obj.reason,
      obj.comment,
      obj.expiry,
      obj.auto,
      obj.ban_all,
      obj.ban_post,
      obj.ban_comment,
      obj.ban_flag
    );
  }

  constructor(
    timestamp: string,
    public reason: number,
    public comment: string,
    expiry: string,
    public auto: boolean,
    public ban_all: boolean,
    public ban_post: boolean,
    public ban_comment: boolean,
    public ban_flag: boolean,
  ) {
    this.timestamp = new Date(timestamp);
    this.expiry = new Date(expiry);
  }

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
