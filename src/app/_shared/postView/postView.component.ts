import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDeletionDialogComponent } from '../../_dialogs/confirmDeletion.dialog.component';
import { FlagDialogComponent } from '../../_dialogs/flag.dialog.component';
import { ShareDialogComponent } from '../../_dialogs/share.dialog.component';
import { Area } from '../../_models/area';
import { Author } from '../../_models/author';
import { Comment } from '../../_models/comment';
import { CommentData } from '../../_models/commentData';
import * as C from '../../_models/constants';
import { Link } from '../../_models/link';
import { Post } from '../../_models/post';
import { Reputation } from '../../_models/reputation';
import { AreaService } from '../../_services/area.service';
import { CommentService } from '../../_services/comment.service';
import { FlagService } from '../../_services/flag.service';
import { NavBarService } from '../../_services/navBar.service';
import { PostService } from '../../_services/post.service';
import { ProfileService } from '../../_services/profile.service';
import { RouteService } from '../../_services/route.service';

enum TypeOfReport {
  Post,
  Comment
}

@Component({
  templateUrl: 'postView.component.html',
  styleUrls: ['./postView.component.scss']
})
export class PostViewComponent implements OnInit, OnDestroy {
  private systemAuthor: Author = new Author(375, 'WildFyre', false, '', '');
  areaCheck: string;
  blockedUsers: string[];
  blanketText = `<span class="markdown fyre-blanket"><p>Fyre Blanket</p></span>`;
  areas = new Array<Area>(new Area('', ''));
  commentBoxOpen = false;
  commentCount = 0;
  commentForm: FormGroup;
  componentDestroyed: Subject<boolean> = new Subject();
  currentArea: Area;
  errors: any;
  fakePost: Post = new Post(0, this.systemAuthor, false, false, Date(), false,
    'No more posts in this area, try creating one?', null, null, []);
  hasPostId = false;
  isCopied = false;
  loading = true;
  loggedIn = true;
  parsedCommentArray: string[] = [];
  post: Post = this.fakePost;
  rep: Reputation;
  selfObj: Author;
  wait = true;

  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private areaService: AreaService,
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

    this.commentForm = new FormGroup({
      'comment': new FormControl(''),
      'image': new FormControl('')
    });

    this.routeService.resetRoutes();

    this.navBarService.comment.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((comment: CommentData) => {
        this.cdRef.detectChanges();
        if (!this.wait) {
          if (comment.comment !== '' && this.runImageCheck(comment.comment)) {
            if (comment.image) {
              this.postService.setPicture(comment.image, this.post, this.currentArea.name, false, comment.comment).pipe(
                takeUntil(this.componentDestroyed))
                .subscribe(result2 => {
                  if (!result2.getError()) {
                    this.post.comments.push(result2);
                  } else {
                    this.snackBar.open('Your image file must be below 512KiB in size', 'Close', {
                      duration: 3000
                    });
                  }
              });
            } else {
              this.postService.comment(this.currentArea.name, this.post, comment.comment).pipe(
                takeUntil(this.componentDestroyed))
                .subscribe();
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

    this.areaService.areas.pipe(
      takeUntil(this.componentDestroyed))
    .subscribe(areas => {
      this.areas = [];

      for (let i = 0; i < areas.length; i++) {
        this.areaService.reputation.pipe(
          takeUntil(this.componentDestroyed))
          .subscribe(result => {
            let area;
            area = new Area(
              areas[i].name,
              areas[i].displayname,
            );

            this.rep = Reputation.parse(result[areas[i].name])

            this.areas.push(area);
            this.cdRef.detectChanges();
        });
      }
    });

    this.profileService.self.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe( (author: Author) => {
        this.selfObj = author;
        this.loggedIn = true;
    });

    this.route.params.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(params => {
        if (params['area'] !== undefined) {
          this.areaService.areas
          .subscribe(area => {
            this.currentArea = area[params['area']];
            if (params['id']) {
              this.hasPostId = true;
              this.postService.getPost(this.currentArea.name, params['id']).pipe(
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
                setTimeout(() => {
                  window.scrollTo({
                    top: document.getElementById(String(this.parsedCommentArray[0])).offsetTop - 25,
                    left: 0,
                    behavior: 'smooth'
                  });
                }, 2000);
              }
            } else {
              this.refresh(true);
            }
          });
        } else {
          this.refresh(true);
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

  copylink(c?: Comment) {
    let extension = '';

    if (c !== undefined) {
      extension += `/${c.id}`;
    }

    this.copyStringToClipboard(`https://client.wildfyre.net/areas/${this.currentArea}/${this.post.id}${extension}`);
    this.snackBar.open('Link copied successfully', 'Close', {
      duration: 3000
    });
  }

  copyStringToClipboard (str: string) {
    // Create new element
    const el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
 }

  info(e: any) {

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

  getCommentBackground(c: number) {
    return this.parsedCommentArray.find(comment => comment === String(c)) !== undefined ? true : false;
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

  gotoUser(user: number) {
    this.routeService.addNextRoute(this.router.url);
    this.router.navigateByUrl('/user/' + user);
  }

  isBlockedUser(c: number) {
    return this.blockedUsers.includes(String(c));
  }

  hideViews() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('comment').style.display = 'none';
    document.getElementById('comment-box').style.display = 'none';
    document.getElementById('comment-tab').style.display = 'none';
    this.errors = null;
    this.loading = false;
  }

  openCommentDeleteDialog(c: Comment) {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (result.bool) {
          this.commentService.deleteComment(
            this.currentArea.name,
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

  openPostDeleteDialog() {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (result.bool) {
          this.postService.deletePost(this.currentArea.name, this.post.id, false);
          this.snackBar.open('Post deleted successfully', 'Close', {
            duration: 3000
          });
          this.back();
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

  postComment() {
    this.loading = true;
    const com = this.commentForm.controls.comment.value;
    const comImage = this.commentForm.controls.image.value;
    this.commentForm.disable();
    this.navBarService.comment.next(new CommentData(com, comImage));
    this.commentForm.controls.comment.setValue('');
    this.commentForm.enable();
    this.loading = false;
  }

  refresh(reload: boolean) {
    this.wait = true;
    this.loading = true;

    this.route.params.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(params => {
        if (params['area'] !== undefined) {
          this.areaService.areas
          .subscribe(area => {
            let currentArea = area.find(x => x.name === String(params['area']));;
            if (currentArea !== undefined && currentArea.name !== '') {
              this.currentArea = currentArea;

              if ((reload === true || this.areaCheck !== currentArea.name) && currentArea.name !== '') {
                this.postService.getNextPost(currentArea.name).pipe(
                  takeUntil(this.componentDestroyed))
                  .subscribe(nextPost => {
                    if (nextPost) {
                      this.post = nextPost;
                      this.commentCount = this.post.comments.length;
                      this.loading = false;
                      this.areaCheck = this.currentArea.name;
                      this.navBarService.hasPost.next(true);
                      this.cdRef.detectChanges();
                    } else {
                      this.fakePost = new Post(0, this.systemAuthor, false, false,
                        Date(), false, 'No more posts in this area, try creating one?', null, null, []);
                      this.post = this.fakePost;
                      this.commentCount = 0;
                      this.loading = false;
                      this.areaCheck = this.currentArea.name;
                      this.navBarService.hasPost.next(false);
                      this.cdRef.detectChanges();
                    }
                });
              } else {
                this.postService.getPost(this.currentArea.name, this.post.id, false).pipe(
                  takeUntil(this.componentDestroyed))
                  .subscribe(post => {
                    this.post = post;
                    this.commentCount = this.post.comments.length;
                    this.loading = false;
                    this.areaCheck = this.currentArea.name;
                    this.navBarService.hasPost.next(true);
                    this.cdRef.detectChanges();
                });
              }
            }
          });
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

  commentView() {
    if (this.commentBoxOpen) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      document.getElementById('comment-box').style.display = 'none';
      this.commentBoxOpen = false;
    } else {
      if (document.getElementById('comment-list') !== null) {
        window.scrollTo({
          top: document.getElementById('comment-list').offsetTop - 25,
          left: 0,
          behavior: 'smooth'
        });
      }
      document.getElementById('comment-box').style.display = 'flex';
      this.commentBoxOpen = true;
    }
  }

  deletePost() {

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
      this.currentArea.name,
      this.post,
      spread
    );

    this.postService.getNextPost(this.currentArea.name)
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
      });
  }

  subscribe(s: boolean) {
    this.postService.subscribe(this.currentArea.name, this.post, s).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe();
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
