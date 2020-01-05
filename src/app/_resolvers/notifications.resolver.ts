import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { NotificationService } from '../_services/notification.service';

@Injectable()
export class NotificationsResolver implements Resolve<void> {
  constructor(
    private notificationService: NotificationService
  ) {}

  resolve() {
    this.notificationService.getSuperNotification(10, 0);
  }
}
