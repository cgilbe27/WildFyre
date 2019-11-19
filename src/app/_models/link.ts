export class Link {
  constructor(
    public url: string,
    public discription: string,
    public author: string
  ) { }

  getError(): null {
    return null;
  }
}
