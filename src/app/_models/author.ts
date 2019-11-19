export class Author {
  static parse(obj: any) {
    return new Author(
      obj.user,
      obj.name,
      obj.avatar,
      obj.bio,
      obj.banned
    );
  }

  constructor(
    public user: number,
    public name: string,
    public avatar: string,
    public bio: string,
    public banned: boolean
  ) { }

  getError(): AuthorError {
    return null;
  }
}

export class AuthorError extends Author {
  constructor(
    public non_field_errors?: string[],
    public _text?: string[]
  ) {
    super(null, null, null, null, null);
  }

    getError(): AuthorError {
      return this;
    }

}
