export class Author {
  static parse(obj: any) {
    return new Author(
      obj.user,
      obj.name,
      obj.banned,
      obj.avatar,
      (() => {
        if (obj.bio === '') {
          obj.bio = "*This user doesn't know what they want to be yet.*";
        }

        return obj.bio
      })() // Call method
    );
  }

  constructor(
    public user: number,
    public name: string,
    public banned: boolean,
    public avatar?: string | string[],
    public bio?: string | string[]
  ) { }

  getError(): AuthorError {
    return null;
  }
}

export class AuthorError extends Author {
  constructor(
    public non_field_errors?: string[],
    public detail?: string,
    public avatar?: string[],
    public bio?: string[]
  ) {
    super(null, null, null, null, null);
  }

    getError(): AuthorError {
      return this;
    }

}
