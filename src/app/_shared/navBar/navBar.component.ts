import { Component, OnInit, OnDestroy, ChangeDetectorRef, DoCheck } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { NotificationService } from '../../_services/notification.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'navBar.component.html',
  styleUrls: ['./navBar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy, DoCheck {
  activeLinkIndex = 1;
  componentDestroyed: Subject<boolean> = new Subject();
  loggedIn = false;
  notificationLength = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    if (this.authenticationService.token) {
      this.setActiveIndex(this.router.url);
      this.loggedIn = true;

      this.notificationService.getSuperNotification(10, 0).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(superNotification => {
        this.notificationLength = superNotification.count;
        this.cdRef.detectChanges();
    });
    } else {
      this.activeLinkIndex = -1;
    }

    interval(2000 * 60).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(() => {
        if (this.authenticationService.token) {
          this.setActiveIndex(this.router.url);
          this.loggedIn = true;

          this.notificationService.getSuperNotification(10, 0).pipe(
          takeUntil(this.componentDestroyed))
          .subscribe(superNotification => {
            this.notificationLength = superNotification.count;
            this.cdRef.detectChanges();
        });
        } else {
          this.activeLinkIndex = -1;
        }
    });
  }

  ngDoCheck()	{
    this.setActiveIndex(this.router.url);
  }


  ngOnDestroy() {
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  getNotificationLength(nLength: number) {
    if (nLength.toString().length === 4) {
      return nLength.toString().slice(0, 1) + 'K';
    } else if (nLength.toString().length === 5) {
      return nLength.toString().slice(0, 2) + 'K';
    } else if (nLength.toString().length >= 6) {
      return '\u221E';
    } else {
      return nLength.toString();
    }
  }

  setActiveIndex(s: string) {
    if (s === undefined) {
      s = '/';
    }
    if (s === '/profile') {
      this.activeLinkIndex = 4;
    } else if (s === '/notifications/archive') {
      this.activeLinkIndex = 2;
    } else if (s.lastIndexOf('/notifications/archive/') !== -1) {
      this.activeLinkIndex = 2;
    } else if (s === '/notifications') {
      this.activeLinkIndex = 2;
    } else if (s.lastIndexOf('/notifications/') !== -1) {
      this.activeLinkIndex = 2;
    } else if (s === '/') {
      this.activeLinkIndex = 1;
    } else if (s === '/posts') {
      this.activeLinkIndex = 3;
    } else if (s.lastIndexOf('/posts/') !== -1) {
      this.activeLinkIndex = 3;
    } else if (s === '/create') {
      this.activeLinkIndex = -1;
    } else if (s.lastIndexOf('/create/') !== -1) {
      this.activeLinkIndex = -1;
    } else if (s === '/drafts') {
      this.activeLinkIndex = -1;
    } else if (s.lastIndexOf('/areas/') !== -1) {
      this.activeLinkIndex = -1;
    } else if (s.lastIndexOf('/user/') !== -1) {
      this.activeLinkIndex = -1;
    } else if (s.lastIndexOf('/login') !== -1) {
      this.activeLinkIndex = -1;
    }
    this.cdRef.detectChanges();
  }

  switchRoute(s: string) {
    if (s === 'home') {
      this.router.navigateByUrl('/');
    } else if (s === 'profile') {
      this.router.navigateByUrl('/profile');
    } else if (s === 'notifications') {
      this.router.navigateByUrl('/notifications');
    } else if (s === 'my-posts') {
      this.router.navigateByUrl('/posts');
    }
  }
}
