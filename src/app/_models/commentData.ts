export class CommentData {
  constructor(
    public comment: string,
    public image: any
  ) { }

  getError(): null {
    return null;
  }
}
