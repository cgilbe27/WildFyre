import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { MatSidenav, MatDialog, MatSnackBar } from '@angular/material';
import { Subject, interval } from 'rxjs';
import { Router } from '@angular/router';
import { LogoutDialogComponent } from '../_dialogs/logout.dialog.component';
import { PictureDialogComponent } from '../_dialogs/picture.dialog.component';
import { Area } from '../_models/area';
import { CommentData } from '../_models/commentData';
import { AreaService } from '../_services/area.service';
import { AuthenticationService } from '../_services/authentication.service';
import { NavBarService } from '../_services/navBar.service';
import { NotificationService } from '../_services/notification.service';
import { BootController } from '../../boot-control';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'navBar.component.html'
})
export class NavBarComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  activeLinkIndex = 2;
  areas = new Array<Area>(new Area('', '', 0, 0));
  areaReputation: { [area: string]: number; } = { };
  areaSpread: { [area: string]: number; } = { };
  areaVisible = true;
  comment: CommentData = new CommentData('', null);
  commentDisabled = false;
  componentDestroyed: Subject<boolean> = new Subject();
  currentArea: Area = this.areas[0];
  expanded = false;
  hasPost = false;
  heightText: string;
  loggedIn = false;
  mobileRouteLinks: any[];
  notificationLength = 0;
  routeLinks: any[];
  rowsExapanded = 2;
  styleBottomEditor: string;
  styleBottomSend: string;
  styleBottomTextarea: string;
  styleDesktop: string;
  styleHeightEditor: string;
  styleHeightSend: string;
  styleHeightTextarea: string;
  styleMobile: string;
  stylePage: boolean;
  width: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private router: Router,
    public snackBar: MatSnackBar,
    private areaService: AreaService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private navBarService: NavBarService
  ) {
    this.routeLinks = [
      {label: 'Profile', link: '/profile/', index: '0'},
      {label: 'Notifications', link: '/notifications/1/', index: '1'},
      {label: 'Home', link: '/', index: '2'},
      {label: 'My Posts', link: '/posts/1/', index: '3'},
      {label: 'Create a Post', link: '/create/', index: '4'}
    ];

    this.mobileRouteLinks = [
      {label: '<i class="material-icons">perm_identity</i>', link: '/profile/', index: '0'},
      {label: '<i class="material-icons">notifications_none</i>', link: '/notifications/1/', index: '1'},
      {label: '<i class="material-icons">home</i>', link: '/', index: '2'},
      {label: '<i class="material-icons">content_copy</i>', link: '/posts/1/', index: '3'},
      {label: '<i class="material-icons">create</i>', link: '/create/', index: '4'}
    ];
  }

  ngOnInit() {
    this.navBarService.areaVisible.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((visible: boolean) => {
        this.areaVisible = visible;
        this.cdRef.detectChanges();
    });

    this.navBarService.hasPost.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((has: boolean) => {
        this.hasPost = has;
        this.cdRef.detectChanges();
    });

    this.navBarService.clearInputs.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((action: boolean) => {
        if (action) {
          this.comment.comment = '';
          this.comment.image = null;
          this.contractBox();
          this.commentDisabled = false;
        } else {
          this.commentDisabled = false;
        }
    });

    this.navBarService.loggedIn.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((loggedIn: boolean) => {
        if (loggedIn === true) {
          this.login();
          this.styleMobile = '';
          this.styleDesktop = '';
        }
        this.cdRef.detectChanges();
    });

    if (this.authenticationService.token) {
      this.login();
      this.loggedIn = true;
    } else {
      this.styleMobile = 'none';
      this.styleDesktop = 'none';
      this.navBarService.areaVisible.next(false);
      this.cdRef.detectChanges();
    }
  }

  ngOnDestroy() {
    this.contractBox();
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  private addLineBreak(s: string) {
    if (this.comment.comment !== '') {
      this.comment.comment += '\n';
    }
    this.comment.comment += s;
  }

  addBlockQoutes() {
    this.addLineBreak('> Blockquote example');
  }

  addBold() {
    this.addLineBreak('**Example**');
  }

  addImage() {
    const dialogRef = this.dialog.open(PictureDialogComponent);
    dialogRef.componentInstance.comment = true;
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((result: { bool: any; picture: any; }) => {
        if (result.bool) {
          this.comment.image = result.picture;
          this.snackBar.open('Image added successfully', 'Close', {
            duration: 3000
          });
        } else {
          this.snackBar.open('You did not select a valid image file', 'Close', {
            duration: 3000
          });
        }
      });
  }

  addItalics() {
    this.addLineBreak('_Example_');
  }

  addStrikethrough() {
    this.addLineBreak('~~Example~~');
  }

  close() {
    this.sidenav.close();
  }

  contractBox() {
    this.expanded = false;
    this.rowsExapanded = 2;
    this.styleMobile = '';

    this.styleHeightTextarea = '56px';

    if (window.screen.width < 600) {
      this.styleHeightTextarea = '40px';
      this.styleBottomTextarea = '40px';
      this.styleBottomEditor = '3px';
      this.styleHeightEditor = '48px';
      this.styleBottomSend = '42px';
      this.styleHeightSend = '38px';
    }
  }

  deleteImage() {
    this.comment.image = null;
    this.snackBar.open('Image removed successfully', 'Close', {
      duration: 3000
    });
  }

  expandBox() {
    this.expanded = true;
    this.rowsExapanded = 3;
    this.styleMobile = 'none';

    this.styleBottomEditor = '48px';
    this.styleHeightTextarea = '96px';

    if (window.screen.width < 600) {
      this.styleHeightTextarea = '118px';
      this.styleBottomTextarea = '0px';
      this.styleBottomEditor = '59px';
      this.styleHeightEditor = '59px';
      this.styleBottomSend = '0px';
      this.styleHeightSend = '59px';
    }
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

  login() {
    this.notificationService.getSuperNotification(10, 0).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(superNotification => {
        this.navBarService.notifications.next(superNotification.count);
        this.cdRef.detectChanges();
    });

    this.styleMobile = '';
    this.styleDesktop = '';

    this.navBarService.notifications.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(num => {
        this.notificationLength = num;
        this.cdRef.detectChanges();
    });

    this.navBarService.isVisibleSource.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((isVisible: string) => {
        this.styleMobile = isVisible;
        this.cdRef.detectChanges();
    });

    interval(2000 * 60).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(x => {
        this.notificationService.getSuperNotification(10, 0).pipe(
          takeUntil(this.componentDestroyed))
          .subscribe(superNotification => {
            this.navBarService.notifications.next(superNotification.count);
            this.cdRef.detectChanges();
        });
    });

    this.router.events.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((url: any) => {
        this.setActiveIndex(url.url);
    });

    this.areaService.getAreas().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(areas => {
        this.areas = [];

        for (let i = 0; i < areas.length; i++) {
          this.areaService.getAreaRep(areas[i].name).pipe(
            takeUntil(this.componentDestroyed))
            .subscribe(result => {
              let area;
              area = new Area(
                areas[i].name,
                areas[i].displayname,
                result.reputation,
                result.spread
              );

              this.areas.push(area);

              this.currentArea = this.areas[0];
              this.areaService.currentAreaName = this.currentArea.name;
              this.navBarService.currentArea.next(this.currentArea);
              this.cdRef.detectChanges();
          });
        }
      });
      this.loggedIn = true;
  }

  onChange(area: Area) {
    this.currentArea = area;
    this.areaService.currentAreaName = this.currentArea.name;
    this.navBarService.currentArea.next(this.currentArea);
  }

  openLogoutDialog() {
    const dialogRef = this.dialog.open(LogoutDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((result: { bool: any; }) => {
        if (result.bool) {
          this.loggedIn = false;
          this.authenticationService.logout();
          // Triggers the reboot in main.ts
          this.ngZone.runOutsideAngular(() => BootController.getbootControl().restart());
          this.cdRef.detach();
          this.componentDestroyed.next(true);
          this.componentDestroyed.complete();

          this.snackBar.open('You were logged out successfully', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl('/login');
        }
      });
  }

  postComment() {
    this.commentDisabled = true;
    this.navBarService.comment.next(this.comment);
  }

  setActiveIndex(s: string) {
    this.width = '100%';
    if (s === undefined) {
      s = '/';
    }
    if (s === '/profile') {
      this.stylePage = false;
      this.activeLinkIndex = 0;
      this.navBarService.areaVisible.next(false);
    } else if (s === '/notifications/archive') {
      this.stylePage = false;
      this.width = '90%';
      this.activeLinkIndex = 1;
      this.navBarService.areaVisible.next(true);
    } else if (s.lastIndexOf('/notifications/archive/') !== -1) {
      this.stylePage = false;
      this.width = '90%';
      this.activeLinkIndex = 1;
      this.navBarService.areaVisible.next(true);
    } else if (s === '/notifications') {
      this.stylePage = false;
      this.activeLinkIndex = 1;
      this.navBarService.areaVisible.next(false);
    } else if (s.lastIndexOf('/notifications/') !== -1) {
      this.stylePage = false;
      this.activeLinkIndex = 1;
      this.navBarService.areaVisible.next(false);
    } else if (s === '/') {
      this.stylePage = true;
      this.activeLinkIndex = 2;
      this.navBarService.areaVisible.next(true);
    } else if (s === '/posts') {
      this.stylePage = false;
      this.activeLinkIndex = 3;
      this.navBarService.areaVisible.next(true);
    } else if (s.lastIndexOf('/posts/') !== -1) {
      this.stylePage = false;
      this.activeLinkIndex = 3;
      this.navBarService.areaVisible.next(true);
    } else if (s === '/create') {
      this.stylePage = false;
      this.activeLinkIndex = 4;
      this.navBarService.areaVisible.next(true);
    } else if (s.lastIndexOf('/create/') !== -1) {
      this.stylePage = false;
      this.activeLinkIndex = 4;
      this.navBarService.areaVisible.next(false);
    } else if (s === '/drafts') {
      this.stylePage = false;
      this.width = '90%';
      this.activeLinkIndex = 4;
      this.navBarService.areaVisible.next(true);
    } else if (s.lastIndexOf('/areas/') !== -1) {
      this.stylePage = true;
      this.width = '90%';
      this.activeLinkIndex = 2;
      this.navBarService.areaVisible.next(false);
    } else if (s.lastIndexOf('/user/') !== -1) {
      this.stylePage = false;
      this.width = '90%';
      this.activeLinkIndex = 0;
      this.navBarService.areaVisible.next(false);
    }
    this.cdRef.detectChanges();
  }
}
