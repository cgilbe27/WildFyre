export class Area {
  static parse(obj: any) {
    return new Area(
      obj.name,
      obj.displayname
    );
  }

  constructor(
    public name: string,
    public displayname: string
  ) { }

  getError(): null {
    return null;
  }
}
