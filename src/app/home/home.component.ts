
import {takeUntil} from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ConfirmDeletionDialogComponent } from '../_dialogs/confirmDeletion.dialog.component';
import { FlagDialogComponent } from '../_dialogs/flag.dialog.component';
import { ShareDialogComponent } from '../_dialogs/share.dialog.component';
import { Area } from '../_models/area';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { CommentData } from '../_models/commentData';
import * as C from '../_models/constants';
import { Link } from '../_models/link';
import { Post } from '../_models/post';
import { Reputation } from '../_models/reputation';
import { CommentService } from '../_services/comment.service';
import { FlagService } from '../_services/flag.service';
import { NavBarService } from '../_services/navBar.service';
import { PostService } from '../_services/post.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';

enum TypeOfReport {
  Post,
  Comment
}

@Component({
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private systemAuthor: Author = new Author(375, 'WildFyre', '', '', false);
  areaCheck: string;
  blockedUsers: string[];
  blanketText = `<span class="markdown fyre-blanket"><p>Fyre Blanket</p></span>`;
  commentCount = 0;
  componentDestroyed: Subject<boolean> = new Subject();
  currentArea: string;
  fakePost: Post = new Post(0, this.systemAuthor, false, false, Date(), false,
    'No more posts in this area, try creating one?', null, null, []);
  isCopied = false;
  loading = true;
  loggedIn = true;
  post: Post = this.fakePost;
  rep: Reputation;
  userID: number;
  wait = true;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private commentService: CommentService,
    private flagService: FlagService,
    private navBarService: NavBarService,
    private postService: PostService,
    private profileService: ProfileService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.loading = true;

    this.blockedUsers = [];
    if (window.localStorage.getItem('blockedUsers')) {
      this.blockedUsers = window.localStorage.getItem('blockedUsers').split(',');
      this.blockedUsers.pop();
    }

    this.routeService.resetRoutes();

    this.navBarService.comment.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((comment: CommentData) => {
        this.cdRef.detectChanges();
        if (!this.wait) {
          if (comment.comment !== '' && this.runImageCheck(comment.comment)) {
            if (comment.image) {
              this.postService.setPicture(comment.image, this.post, this.currentArea, false, comment.comment).pipe(
                takeUntil(this.componentDestroyed))
                .subscribe(result2 => {
                  if (!result2.getError()) {
                    this.post.comments.push(result2);
                    this.navBarService.clearInputs.next(true);
                  } else {
                    this.snackBar.open('Your image file must be below 512KiB in size', 'Close', {
                      duration: 3000
                    });
                  }
              });
            } else {
              this.postService.comment(this.currentArea, this.post, comment.comment).pipe(
                takeUntil(this.componentDestroyed))
                .subscribe();
                this.navBarService.clearInputs.next(true);
            }
            this.commentCount += 1;
            this.cdRef.detectChanges();
          } else {
            this.snackBar.open(
              'Please enter something'
              , 'Close', {
              duration: 3000
            });
            this.navBarService.clearInputs.next(false);
        }
      }
      this.wait = false;
    });

    this.profileService.getSelf().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe( (author: Author) => {
        this.userID = author.user;
        this.loggedIn = true;
    });
    this.refresh(true);
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  blockUser(id: number) {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (result.bool) {
          if (window.localStorage.getItem('blockedUsers')) {
            window.localStorage.setItem('blockedUsers', window.localStorage.getItem('blockedUsers') + String(id + ','));
          } else {
            window.localStorage.setItem('blockedUsers', String(id + ','));
          }
          this.ngOnInit();
        }
      });
  }

  unblockUser(id: number) {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (result.bool) {
          if (window.localStorage.getItem('blockedUsers')) {
            window.localStorage.setItem('blockedUsers', window.localStorage.getItem('blockedUsers').replace(id + ',', ''));
          }
          this.ngOnInit();
        }
      });
  }

  getCommentLength(nLength: number) {
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

  getImageMatchesByGroup(index: number, str: string, reg: RegExp): string[] {
    let match: any;
    const matches: string[] = [];
    // Find any occurence of image markdown
    while ((match = reg.exec(str))) {
      if (match[index] !== undefined) {
        matches.push(match[index]);
      }
    }
    return matches;
  }

  gotoUser(user: string) {
    this.routeService.addNextRoute(this.router.url);
    this.router.navigateByUrl('/user/' + user);
  }

  isBlockedUser(c: number) {
    return this.blockedUsers.includes(String(c));
  }

  openCommentDeleteDialog(c: Comment) {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (result.bool) {
          this.commentService.deleteComment(
            this.currentArea,
            this.post,
            c
          );
          this.commentCount -= 1;
          this.snackBar.open('Comment deleted successfully', 'Close', {
            duration: 3000
          });
        }
      });
  }

  openFlagDialog(comment: Comment, typeOfFlagReport: TypeOfReport) {
    this.flagService.currentComment = comment;
    this.flagService.currentPost = this.post;

    const dialogRef = this.dialog.open(FlagDialogComponent);
    dialogRef.componentInstance.typeOfReport = typeOfFlagReport;

    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        this.flagService.sendFlagReport(result.typeOfReport, result.report, result.choice, result.area);
      });
  }

  refresh(reload: boolean) {
    this.wait = true;
    this.loading = true;
    this.navBarService.currentArea.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((currentArea: Area) => {
        if (currentArea.name !== '') {
          this.currentArea = currentArea.name;

          if ((reload === true || this.areaCheck !== currentArea.name) && currentArea.name !== '') {
            this.postService.getNextPost(currentArea.name).pipe(
              takeUntil(this.componentDestroyed))
              .subscribe(nextPost => {
                if (nextPost) {
                  this.post = nextPost;
                  this.commentCount = this.post.comments.length;
                  this.loading = false;
                  this.areaCheck = this.currentArea;
                  this.navBarService.hasPost.next(true);
                  this.cdRef.detectChanges();
                } else {
                  this.fakePost = new Post(0, this.systemAuthor, false, false,
                    Date(), false, 'No more posts in this area, try creating one?', null, null, []);
                  this.post = this.fakePost;
                  this.commentCount = 0;
                  this.loading = false;
                  this.areaCheck = this.currentArea;
                  this.navBarService.hasPost.next(false);
                  this.cdRef.detectChanges();
                }
            });
          } else if (currentArea.name === '') {
          } else {
            this.postService.getPost(this.currentArea, this.post.id, false).pipe(
              takeUntil(this.componentDestroyed))
              .subscribe(post => {
                this.post = post;
                this.commentCount = this.post.comments.length;
                this.loading = false;
                this.areaCheck = this.currentArea;
                this.navBarService.hasPost.next(true);
                this.cdRef.detectChanges();
            });
          }
        }
    });

    this.cdRef.detectChanges();
  }

  runImageCheck(comment: string): boolean {
    this.cdRef.detectChanges();
    const linkMatch = this.getImageMatchesByGroup(1, comment, C.WF_IMAGE_REGEX);
    // Find duplicates and invalids
    if (linkMatch.length > 0) {
      return false;
    }
    return true;
  }

  share(commentID: number) {
    let commentURL = '';
    let authorName = this.post.author.name;
    let description = this.post.text.slice(0, 100);

    if (commentID !== undefined) {
      commentURL = '/' + commentID.toString();

      for (let i = 0; i < this.post.comments.length; i++) {
        if (this.post.comments[i].id === commentID) {
          authorName = this.post.comments[i].author.name;
          description = this.post.comments[i].text.slice(0, 100);
        }
      }
    }

    this.navBarService.link.next(
      new Link('https://client.wildfyre.net/areas/'
        + this.currentArea + '/' + this.post.id + commentURL,
        description,
        authorName
      ));
    const dialogRef = this.dialog.open(ShareDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (result.isLink) {
          this.snackBar.open('Link copied successfully', 'Close');
        }
      });
  }

  spread(spread: boolean) {
    this.loading = true;
    this.navBarService.clearInputs.next(true);
    this.cdRef.detectChanges();
    this.postService.spread(
      this.currentArea,
      this.post,
      spread
    );

    this.postService.getNextPost(this.currentArea)
      .subscribe(nextPost => {
        if (nextPost) {
          this.post = nextPost;
          this.loading = false;
          this.cdRef.detectChanges();
        } else {
          this.fakePost = new Post(0, this.systemAuthor, false, false,
            Date(), false, 'No more posts in this area, try creating one?', null, null, []);
          this.post = this.fakePost;
          this.loading = false;
          this.cdRef.detectChanges();
        }
        window.scrollTo(0, 0);
      });
  }

  subscribe(s: boolean) {
    this.postService.subscribe(this.currentArea, this.post, s).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe();
  }
}
