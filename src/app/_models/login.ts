export class Login {
  static parse(obj: any) {
    return new Login(
      obj.username,
      obj.password
    );
  }

  constructor(
    public username: string,
    public password: string
  ) { }
}
