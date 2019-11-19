export class Reputation {
  static parse(obj: any) {
    return new Reputation(
      obj.reputation,
      obj.spread
    );
  }

  constructor(
    public reputation: number,
    public spread: number
  ) { }

  getError(): null {
    return null;
  }
}
