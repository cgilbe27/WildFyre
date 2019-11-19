export class Area {
  static parse(obj: any) {
    return new Area(
      obj.name,
      obj.displayname,
      obj.rep,
      obj.spread
    );
  }

  constructor(
    public name: string,
    public displayname: string,
    public rep: number,
    public spread: number
  ) { }

  getError(): null {
    return null;
  }
}
