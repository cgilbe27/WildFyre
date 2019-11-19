import {Author} from './author';

export class Comment {
  public created: Date;

  static parse(obj: any) {
    return new Comment(
      obj.id,
      obj.author,
      obj.created,
      obj.text,
      obj.image
    );
  }

  constructor(
    public id: number,
    public author: Author,
    created: string,
    public text: string,
    public image: string
  ) {
    this.created = new Date(created);
  }

  getError(): CommentError {
    return null;
  }
}

export class CommentError extends Comment {
  constructor(
    public non_field_errors?: string[],
    public _text?: string[]
  ) {
    super(null, null, null, null, null);
  }

  getError(): CommentError {
    return this;
  }
}
