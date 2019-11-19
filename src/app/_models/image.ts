export class Image {
  static parse(obj: any) {
    return new Image(
      obj.num,
      obj.image,
      obj.comment
    );
  }

  constructor(
    public num: number,
    public image: string,
    public comment: string
  ) { }

  getError(): ImageError {
    return null;
  }
}

export class ImageError extends Image {
  constructor(
    public non_field_errors?: string[],
    public _text?: string[]
  ) {
    super(null, null, null);
  }

  getError(): ImageError {
    return this;
  }
}
