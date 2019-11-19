import { Ban } from './ban';

export class SuperBan {
  static parse(obj: any) {
    return new SuperBan(
      obj.count,
      obj.next,
      obj.previous,
      (() => {
        const bans: Ban[] = [];
        obj.results.forEach((ban: any) => {
          bans.push(Ban.parse(ban));
        });
        return bans;
      })()  // Call method
    );
  }

  constructor(
    public count: number,
    public next: string,
    public previous: string,
    public results: Ban[]
  ) { }

  getError(): SuperBanError {
    return null;
  }
}

export class SuperBanError extends SuperBan {
  constructor(
    public non_field_errors?: string[],
    public _text?: string[]
  ) {
    super(null, null, null, null);
  }

  getError(): SuperBanError {
    return this;
  }
}
