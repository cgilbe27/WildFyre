
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SuperNotification } from '../_models/superNotification';
import { SuperPost } from '../_models/superPost';
import { HttpService } from './http.service';

@Injectable()
export class NotificationService {
  public superNotification: BehaviorSubject<SuperNotification> = new BehaviorSubject(undefined);
  public superPosts: BehaviorSubject<{ [area: string]: SuperPost; }> = new BehaviorSubject({});

  constructor(
    private httpService: HttpService
  ) { }

  deleteNotifications(): void {
    // get notifications from api
    this.httpService.DELETE('/areas/notification/')
      .subscribe();
      this.superNotification = null;
  }

  getArchive(area: string, limit: number, offset: number): void {
    this.superPosts.subscribe(superPosts => {
      if (superPosts[area] === undefined) {
        this.httpService.GET('/areas/' + area + '/subscribed/?limit=' + limit + '&offset=' + offset)
        .subscribe((response) => {
          superPosts[area] = SuperPost.parse(response);
          this.superPosts.next(superPosts)
        });
      }
    });
  }

  // getNotificationLength() {
  //   if (this.superNotification.count === 0) {
  //     this.getSuperNotification(10, 0)
  //       .subscribe(superNotification => {
  //         this.superNotification = superNotification;
  //         return superNotification.count;
  //       });
  //   } else {
  //     return this.superNotification.count;
  //   }
  // }

  getSuperNotification(limit: number, offset: number): void {
    if (offset === undefined) {
      offset = 0;
    }

    this.superNotification.subscribe(superNotification => {
      if (superNotification === undefined) {
        this.httpService.GET('/areas/notification/?limit=' + limit + '&offset=' + offset)
        .subscribe((response) => {
          superNotification = SuperNotification.parse(response);
          this.superNotification.next(superNotification);
        });
      }
    });
  }
}
