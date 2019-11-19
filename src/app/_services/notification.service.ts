
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { SuperNotification } from '../_models/superNotification';
import { SuperPost } from '../_models/superPost';
import { HttpService } from './http.service';
import { NavBarService } from '../_services/navBar.service';

@Injectable()
export class NotificationService {
  superNotification: SuperNotification;
  superPosts: { [area: string]: SuperPost; } = {};

  constructor(
    private httpService: HttpService,
    private navBarService: NavBarService
  ) { }

  deleteNotifications(): void {
    // get notifications from api
    this.httpService.DELETE('/areas/notification/')
      .subscribe();
      this.superNotification = null;
  }

  getArchive(area: string, limit: number, offset: number): Observable<SuperPost> {
    return this.httpService.GET('/areas/' + area + '/subscribed/?limit=' + limit + '&offset=' + offset).pipe(
      map((response: Response) => {
        this.superPosts[area] = SuperPost.parse(response);

        return this.superPosts[area];
      }));
  }

  getNotificationLength() {
    if (this.superNotification.count === 0) {
      this.getSuperNotification(10, 0)
        .subscribe(superNotification => {
          this.superNotification = superNotification;
          return superNotification.count;
        });
    } else {
      return this.superNotification.count;
    }
  }

  getSuperNotification(limit: number, offset: number): Observable<SuperNotification> {
    if (offset === undefined) {
      offset = 0;
    }
    return this.httpService.GET('/areas/notification/?limit=' + limit + '&offset=' + offset).pipe(
      map((response: Response) => {
        this.superNotification = SuperNotification.parse(response);
        return this.superNotification;
      }));
  }
}
