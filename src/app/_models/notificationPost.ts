import { Author } from './author';

export class NotificationPost {
  static parse(obj: any) {
    return new NotificationPost(
      obj.id,
      obj.author === null ? new Author(498, 'Anonymous', false, 'https://static.wildfyre.net/anonym.svg', null) : Author.parse(obj.author),
      obj.text
    );
  }

  constructor(
    public id: number,
    public author: Author,
    public text: string
  ) { }

  getError(): null {
    return null;
  }
}
