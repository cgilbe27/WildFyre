import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ConfirmDeletionDialogComponent } from '../_dialogs/confirmDeletion.dialog.component';
import { FlagDialogComponent } from '../_dialogs/flag.dialog.component';
import { ShareDialogComponent } from '../_dialogs/share.dialog.component';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { CommentData } from '../_models/commentData';
import * as C from '../_models/constants';
import { Link } from '../_models/link';
import { Post } from '../_models/post';
import { CommentService } from '../_services/comment.service';
import { FlagService } from '../_services/flag.service';
import { NavBarService } from '../_services/navBar.service';
import { PostService } from '../_services/post.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';
import { takeUntil } from 'rxjs/operators';

enum TypeOfReport {
  Post,
  Comment
}

@Component({
  templateUrl: 'postView.component.html',
})
export class PostViewComponent implements OnInit, OnDestroy {
  blockedUsers: string[];
  blanketText = `<span class="markdown fyre-blanket"><p>Fyre Blanket</p></span>`;
  commentCount = 0;
  componentDestroyed: Subject<boolean> = new Subject();
  currentArea: string;
  isCopied = false;
  imageData: any = null;
  loading: boolean;
  lock = false;
  loggedIn: boolean;
  parsedCommentArray: string[] = [];
  post: Post;
  userID: number;
  wait = true;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private commentService: CommentService,
    private flagService: FlagService,
    private navBarService: NavBarService,
    private postService: PostService,
    private profileService: ProfileService,
    private routeService: RouteService,
  ) { }

  ngOnInit() {
    this.loading = true;

    this.blockedUsers = [];
    if (window.localStorage.getItem('blockedUsers')) {
      this.blockedUsers = window.localStorage.getItem('blockedUsers').split(',');
      this.blockedUsers.pop();
    }

    this.profileService.getSelf().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe( (author: Author) => {
        this.userID = author.user;
        this.loggedIn = true;
      });

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

    this.route.params.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((params: { [x: string]: any; }) => {
        this.currentArea = params['area'];

        this.postService.getPost(this.currentArea, params['id']).pipe(
          takeUntil(this.componentDestroyed))
          .subscribe(post => {
            this.post =  post;
            this.commentCount = this.post.comments.length;
            this.loading = false;
            this.navBarService.hasPost.next(true);
            this.cdRef.detectChanges();
        });

        let commentIDArray = params['comments'];
        commentIDArray = commentIDArray + '-';

        if (commentIDArray) {
          while (commentIDArray.indexOf('-') !== -1) {
            this.parsedCommentArray.push(commentIDArray.slice(0, commentIDArray.indexOf('-')));
            commentIDArray = commentIDArray.slice(commentIDArray.indexOf('-') + 1, commentIDArray.length);
          }
        }
    });
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  back() {
    if (this.routeService.routes.length === 0) {
      this.router.navigateByUrl('');
    } else {
      this.router.navigateByUrl(this.routeService.getNextRoute());
    }
  }

  blockUser(id: number) {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((result: { bool: any; }) => {
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
      .subscribe((result: { bool: any; }) => {
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

  notificationIndication(commentID: number) {
    if (this.parsedCommentArray.indexOf(commentID.toString()) !== -1) {
      if (document.getElementsByClassName('toNotif')[0] && !this.lock) {
        document.getElementsByClassName('toNotif')[0].scrollIntoView();
        this.lock = true;
      }

      return '2px solid #ed763e';
    } else {
      return '';
    }
  }

  openCommentDeleteDialog(c: Comment) {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((result: { bool: any; }) => {
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
      .subscribe((result) => {
        this.flagService.sendFlagReport(result.typeOfReport, result.report, result.choice, result.area);
      });
  }

  openPostDeleteDialog() {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((result: { bool: any; }) => {
        if (result.bool) {
          this.postService.deletePost(this.currentArea, this.post.id, false);
          this.snackBar.open('Post deleted successfully', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl(this.routeService.getNextRoute());
        }
      });
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
      new Link('https://client.wildfyre.net/areas/' + this.currentArea + '/' + this.post.id + commentURL,
      description,
      authorName
    ));
    const dialogRef = this.dialog.open(ShareDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((result: { isLink: any; }) => {
        if (result.isLink) {
          this.snackBar.open('Link copied successfully', 'Close', {
            duration: 3000
          });
        }
      });
  }

  subscribe(s: boolean) {
    this.postService.subscribe(this.currentArea, this.post, s).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe();
  }
}
