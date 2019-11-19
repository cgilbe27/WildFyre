export class Profile {
  static parse(obj: any) {
    return new Profile(
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

  getError(): ProfileError {
    return null;
  }
}

export class ProfileError extends Profile {
  constructor(
    public non_field_errors?: string[],
    public _text?: string[]
  ) {
    super(null, null, null, null, null);
  }

  getError(): ProfileError {
    return this;
  }
}
