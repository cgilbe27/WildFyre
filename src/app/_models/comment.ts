import {Author} from './author';

export class Comment {
  static parse(obj: any) {
    return new Comment(
      obj.id,
      obj.author,
      String(new Date(obj.created)),
      obj.text,
      obj.image
    );
  }

  constructor(
    public id: number,
    public author: Author,
    public created: string,
    public text: string,
    public image: string
  ) { }

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
