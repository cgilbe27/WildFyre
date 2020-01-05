import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { NotificationService } from '../_services/notification.service';

@Injectable()
export class NotificationArchiveResolver implements Resolve<void> {
  constructor(
    private notificationService: NotificationService
  ) {}

  resolve() {
    this.notificationService.getArchive("fun", 10, 0);
  }
}
