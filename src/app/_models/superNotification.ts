import { Notification } from './notification';

export class SuperNotification {
  static parse(obj: any) {
    return new SuperNotification(
      obj.count,
      obj.next,
      obj.previous,
      (() => {
        const notifications: Notification[] = [];
        obj.results.forEach((notification: any) => {
          notifications.push(Notification.parse(notification));
        });
        return notifications;
      })()  // Call method
    );
  }

  constructor(
    public count: number,
    public next: string,
    public previous: string,
    public results: Notification[]
  ) { }

  getError(): SuperNotificationError {
    return null;
  }
}

export class SuperNotificationError extends SuperNotification {
  constructor(
    public non_field_errors?: string[],
    public _text?: string[]
  ) {
    super(null, null, null, null);
  }

  getError(): SuperNotificationError {
    return this;
  }
}
