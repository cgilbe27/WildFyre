import { NotificationPost } from './notificationPost';

export class Notification {
  static parse(obj: any) {
    return new Notification(
      obj.area,
      NotificationPost.parse(obj.post),
      obj.comments
    );
  }

  constructor(
    public area: string,
    public post: NotificationPost,
    public comments: number[]
  ) { }

  getError(): null {
    return null;
  }
}
