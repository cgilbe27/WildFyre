import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ConfirmDeletionDialogComponent } from '../_dialogs/confirmDeletion.dialog.component';
import { Notification } from '../_models/notification';
import { Post } from '../_models/post';
import { SuperNotification } from '../_models/superNotification';
import { NavBarService } from '../_services/navBar.service';
import { NotificationService } from '../_services/notification.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'notification.component.html'
})
export class NotificationComponent implements OnInit, OnDestroy {
  archivedPosts: Post[] = [];
  componentDestroyed: Subject<boolean> = new Subject();
  index = 1;
  limit = 10;
  loading = true;
  notifications: Notification[] = [];
  offset = 10;
  superNotification: SuperNotification;
  totalCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private navBarService: NavBarService,
    private notificationService: NotificationService,
    private routeService: RouteService
  ) { }

  private removeMarkdown(input: string) {
    input = input
      // Remove horizontal rules (stripListHeaders conflict with this rule, which is why it has been moved to the top)
      .replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, '[Horizontal-Rule]')
      // Remove horizontal rules
      .replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, '')
      // Header
      .replace(/\n={2,}/g, '\n')
      // Strikethrough
      .replace(/~~/g, '')
      // Fenced codeblocks
      .replace(/`{3}.*\n/g, '')
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove setext-style headers
      .replace(/^[=\-]{2,}\s*$/g, '')
      // Remove footnotes?
      .replace(/\[\^.+?\](\: .*?$)?/g, '')
      .replace(/\s{0,2}\[.*?\]: .*?$/g, '')
      // Remove images
      .replace(/\!\[.*?\][\[\(].*?[\]\)]/g, '')
      // Remove inline links
      .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
      // Remove blockquotes
      .replace(/^\s{0,3}>\s?/g, '')
      // Remove reference-style links?
      .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, '')
      // Remove atx-style headers
      .replace(/^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm, '$1$2$3')
      // Remove emphasis (repeat the line to remove double emphasis)
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      // Remove code blocks
      .replace(/(`{3,})(.*?)\1/gm, '$2')
      // Remove inline code
      .replace(/`(.+?)`/g, '$1')
      // Replace two or more newlines with exactly two? Not entirely sure this belongs here...
      .replace(/\n{2,}/g, '\n\n');
      return input;
  }

  ngOnInit() {
    this.loading = true;
    this.routeService.resetRoutes();
    this.routeService.addNextRoute('/notification/' + this.index);

    this.route.params
      .takeUntil(this.componentDestroyed)
      .subscribe(params => {
        if (params['index'] !== undefined) {
          this.index = params['index'];
        }
        // get notifications from secure api end point
        this.notificationService.getSuperNotification(this.limit, (this.index * this.limit) - this.limit)
          .takeUntil(this.componentDestroyed)
          .subscribe(superNotification => {
            this.superNotification = superNotification;

            superNotification.results.forEach((obj: any) => {
              this.notifications.push(Notification.parse(obj));
            });

            for (let i = 0; i <= this.notifications.length - 1; i++) {
              this.notifications[i].post.text = this.removeMarkdown(this.notifications[i].post.text);
            }

            this.totalCount = this.superNotification.count;
            this.navBarService.notifications.next(this.superNotification.count);
            this.loading = false;
            this.cdRef.detectChanges();
        });
      });
  }

  ngOnDestroy() {
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  deleteNotifications() {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent);
    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.bool) {
          this.notificationService.deleteNotifications();
          this.notifications = [];
          this.navBarService.notifications.next(0);
          const snackBarRef = this.snackBar.open('Notifications Deleted Successfully', 'Close', {
            duration: 3000
          });
        }
      });

    this.cdRef.detectChanges();
  }

  loadArchive() {
    this.routeService.addNextRoute(this.router.url);
    this.router.navigateByUrl('/notifications/archive/1');
  }

  getNotifications(page: number) {
    this.loading = true;
    this.notifications = [];

    this.notificationService.getSuperNotification(this.limit, (this.offset * page) - this.limit)
      .takeUntil(this.componentDestroyed)
      .subscribe(superNotification => {
        this.superNotification = superNotification;

        superNotification.results.forEach((obj: any) => {
          this.notifications.push(Notification.parse(obj));
        });

        this.index = page;
        this.totalCount = this.superNotification.count;
        this.navBarService.notifications.next(this.superNotification.count);
        this.cdRef.detectChanges();
        this.loading = false;
    });
  }

  goto(areaID: string, postID: number, comments: number[] = []) {
    let commentString = '';

    for (let i = 0; i < comments.length; i++) {
      if (i !== 0) {
        commentString += '-';
      }
      commentString += comments[i];
    }
    this.routeService.addNextRouteByIndex(this.index);
    this.navBarService.notifications.next(this.superNotification.count - 1);
    this.router.navigateByUrl('/areas/' + areaID + '/' + postID + '/' + commentString);
  }
}
