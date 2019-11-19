
import {takeUntil} from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ConfirmDeletionDialogComponent } from '../../_dialogs/confirmDeletion.dialog.component';
import { PictureDialogComponent } from '../../_dialogs/picture.dialog.component';
import { PicturesDialogComponent } from '../../_dialogs/pictures.dialog.component';
import { YouTubeDialogComponent } from '../../_dialogs/youtube.dialog.component';
import { Area } from '../../_models/area';
import * as C from '../../_models/constants';
import { Image } from '../../_models/image';
import { Post, PostError } from '../../_models/post';
import { NavBarService } from '../../_services/navBar.service';
import { PostService } from '../../_services/post.service';
import { RouteService } from '../../_services/route.service';

@Component({
  templateUrl: 'createPost.component.html'
})
export class CreatePostComponent implements OnInit, OnDestroy {
  componentDestroyed: Subject<boolean> = new Subject();
  currentArea: Area;
  errors: PostError;
  imageData: any;
  isDraft = false;
  loading: boolean;
  post: Post = new Post(null, null, false, null, null, null, 's', null, [], []);

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private navBarService: NavBarService,
    private postService: PostService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.post.text = '';
    this.routeService.resetRoutes();

    this.navBarService.currentArea.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((currentArea: Area) => {
        if (currentArea.name !== '') {
          this.currentArea = currentArea;

          this.route.params.pipe(
            takeUntil(this.componentDestroyed))
            .subscribe((params: { [x: string]: number; }) => {
              if (params['id'] !== undefined) {
                this.isDraft = true;

                this.postService.getPost(this.currentArea.name, params['id'], true).pipe(
                  takeUntil(this.componentDestroyed))
                  .subscribe(post => {
                    this.post = post;
                    this.loading = false;
                    this.cdRef.detectChanges();
                });
              }
          });
        }
    });
  }

  ngOnDestroy() {
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  private addLineBreak(s: string) {
    this.post.text = this.post.text !== '' ? this.post.text += `${s}\n` : this.post.text = `${s}\n`;
  }

  addBlockQoutes() {
    this.addLineBreak('> Blockquote example\n> This line is part of the same quote.\n\nQuote break.\n\n>'
    + ' This is a very long line that will still be quoted properly when it wraps. You can *put* **Markdown** into a blockquote.');
  }

  addBold() {
    this.addLineBreak('**Example**');
  }

  addCode() {
    this.addLineBreak('Inline `code` has `back-ticks around` it.\n```javascript\n'
    + 'var s = "JavaScript syntax highlighting";\nalert(s);\n```');
  }

  addHeader(num: number) {
    switch (num) {
      case 1:
      this.addLineBreak('# h1\n');
      break;

      case 2:
      this.addLineBreak('## h2\n');
      break;

      case 3:
      this.addLineBreak('### h3\n');
      break;

      case 4:
      this.addLineBreak('#### h4\n');
      break;

      case 5:
      this.addLineBreak('##### h5\n');
      break;

      case 6:
      this.addLineBreak('###### h6\n');
      break;
      }
  }

  addHorizontalRule() {
    this.addLineBreak('---\n');
  }

  addImage(image: Image) {
    this.addLineBreak(`[img: ${image.num}]\n`);
  }

  addItalics() {
    this.addLineBreak('_Example_');
  }

  addOrderedList() {
    this.addLineBreak('1. First ordered item\n2. Another item\n  * Unordered sub-list.');
  }

  addStrikethrough() {
    this.addLineBreak('~~Example~~');
  }

  addTable() {
    this.addLineBreak('| Tables        | Are           | Cool  |\n| ------------- |:-------------:| -----:|\n'
    + '| col 3 is      | right-aligned | $1600 |\n| col 2 is      | centered      |   $12 |\n| zebra stripes | are neat      |    $1 |');
  }

  addUnorderedList() {
    this.addLineBreak('* Unordered list can use asterisks\n- Or minuses\n+ Or pluses');
  }

  createPost(draft: boolean) {
    this.loading = true;
    this.cdRef.detectChanges();
    if (this.post.text !== '' && this.runImageCheck()) {
      this.postService.createPost(this.currentArea.name, this.post.text, this.post.anonym, this.imageData, draft, this.post.id).pipe(
        takeUntil(this.componentDestroyed))
        .subscribe(result => {
          if (!result.getError()) {
            this.post.text = '';
            let object = 'Post Created';
            if (draft) {
              object = 'Draft Saved';
            }
            this.snackBar.open(object + ' Successfully!', 'Close', {
              duration: 3000
            });
            this.router.navigate(['']);
          } else {
            this.errors = result.getError();
            this.loading = false;
          }
        });
    } else {
      this.loading = false;
      if (this.post.text === '') {
        this.snackBar.open('You did not input anything', 'Close', {
          duration: 3000
        });
      }
    }
  }

  deleteImage() {
    this.postService.deleteImage(null, this.post.id, this.currentArea.name, this.post.text).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result2 => {
        this.post.image = '';
        this.imageData = null;
        this.snackBar.open('Your image was deleted successfully', 'Close', {
          duration: 3000
        });
    });
  }

  deleteImages(image: Image) {
    const sourceString = '[img: ' + image.num + ']\n';
    this.postService.deleteImages(this.post.id, this.currentArea.name, image.num);
    for (let i = 0; i < this.post.additional_images.length; i++) {
      if (this.post.additional_images[i].num === image.num) {
        this.post.additional_images.splice(i, 1);
        this.post.text = this.post.text.replace(sourceString, '').replace('\n' + sourceString, '');
        this.cdRef.detectChanges();
        this.snackBar.open('Image deleted successfully', 'Close', {
          duration: 3000
        });
        break;
      }
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

  loadDrafts() {
    this.routeService.addNextRoute('/create');
    this.router.navigateByUrl('/drafts');
  }

  makeAnonymous(value: any) {
    this.post.anonym = value.checked;
  }

  openDraftDeleteDialog() {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((result: { bool: any; }) => {
        if (result.bool) {
          this.postService.deletePost(this.currentArea.name, this.post.id, true);
          this.snackBar.open('Draft deleted successfully', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl('');
        }
      });
  }

  openPictureDialog() {
    const dialogRef = this.dialog.open(PictureDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((result: { bool: any; picture: any; }) => {
        if (this.post.text === '') {
          this.post.text += '.';
        }
        if (result.bool) {
          if (result.picture) {
            if (this.post.id === null) {
              this.postService.createPost(this.currentArea.name, this.post.text, this.post.anonym, '', true, this.post.id).pipe(
              takeUntil(this.componentDestroyed))
              .subscribe(result3 => {
                this.postService.setPicture(result.picture, result3, this.currentArea.name).pipe(
                  takeUntil(this.componentDestroyed))
                  .subscribe(result4 => {
                    if (result4) {
                      this.imageData = result4.image;
                      this.router.navigateByUrl('/create/' + result3.id);
                    } else {
                      if (result4 === null) {
                        this.snackBar.open(
                          'You have reached the maximum number of images allowed. Please delete some before continuing',
                          'Close', {
                          duration: 3000
                        });
                      } else {
                      this.snackBar.open('Your image file must be below 512KiB in size', 'Close', {
                        duration: 3000
                      });
                    }
                  }
                });
              });
            } else {
              this.postService.setPicture(result.picture, this.post, this.currentArea.name).pipe(
                takeUntil(this.componentDestroyed))
                .subscribe(result2 => {
                  if (!result2.getError()) {
                  this.post.image = result2.image;
                } else {
                  this.snackBar.open('Your image file must be below 512KiB in size', 'Close', {
                    duration: 3000
                  });
                }
                });
            }
          } else {
            this.snackBar.open('You did not select a valid image file', 'Close', {
              duration: 3000
            });
          }
        }
      });
  }

  openPicturesDialog() {
    const dialogRef = this.dialog.open(PicturesDialogComponent);
    let filledSlots: number[] = [];

    if (this.post.additional_images !== []) {
      filledSlots = this.post.additional_images.map(image => image.num);
    }

    dialogRef.componentInstance.nums_taken = filledSlots;
    dialogRef.componentInstance.post = this.post;
    dialogRef.componentInstance.area = this.currentArea.name;

    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((result: { bool: any; picture: any; comment: string; slot: number; }) => {
        if (this.post.text === '') {
          this.post.text += '.';
        }
        if (result.bool) {
          if (result.picture) {
            if (this.post.id === null) {
              this.postService.createPost(this.currentArea.name, this.post.text, this.post.anonym, '', true, this.post.id).pipe(
                takeUntil(this.componentDestroyed))
                .subscribe(result3 => {
                  this.postService.setDraftPictures(result.picture, result3, this.currentArea.name, result.comment, result.slot).pipe(
                    takeUntil(this.componentDestroyed))
                    .subscribe(result4 => {
                      if (result4) {
                        this.post.additional_images.splice(result.slot, 0, result4);
                        this.router.navigateByUrl('/create/' + result3.id);
                      } else {
                        if (result4 === null) {
                          this.snackBar.open(
                            'You have reached the maximum number of images allowed. Please delete some before continuing',
                            'Close', {
                            duration: 3000
                          });
                        } else {
                        this.snackBar.open('Your image file must be below 1MB in size', 'Close', {
                          duration: 3000
                        });
                      }
                    }
                  });
                });
            } else {
              this.postService.setDraftPictures(result.picture, this.post, this.currentArea.name, result.comment, result.slot).pipe(
                takeUntil(this.componentDestroyed))
                .subscribe(result2 => {
                  if (result2) {
                    this.post.additional_images.splice(result.slot, 0, result2);
                  } else {
                    if (result2 === null) {
                      this.snackBar.open(
                        'You have reached the maximum number of images allowed. Please delete some before continuing',
                        'Close', {
                        duration: 3000
                      });
                    } else {
                    this.snackBar.open('Your image file must be below 1MB in size', 'Close', {
                      duration: 3000
                    });
                  }
                }
              });
            }
          } else {
            this.snackBar.open('You did not select a valid image file', 'Close', {
              duration: 3000
            });
          }
        }
      });
  }

  openYoutubeDialog() {
    const dialogRef = this.dialog.open(YouTubeDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((result: any) => {
        if (result.url) {
          result.url = result.url
          .replace('https://', '')
          .replace('http://', '')
          .replace('http://', '')
          .replace('www.', '')
          .replace('m.', '')
          .replace('youtube.com/watch?v=', '')
          .replace('youtu.be/', '')
          .replace('youtube.com/', '')

          if (result.url.indexOf('?') !== -1) {
            result.url = result.url.slice(0, result.url.indexOf('?'));
          }
          this.post.text = this.post.text === undefined ?
          `[![${result.altText}](https://img.youtube.com/vi/${result.url}/0.jpg)](https://www.youtube.com/watch?v=${result.url})\n`
          :
  `[![${result.altText}](https://img.youtube.com/vi/${result.url}/0.jpg)](https://www.youtube.com/watch?v=${result.url})\n${this.post.text}`
      }
      });
  }

  publishDraft() {
    this.loading = true;
    this.cdRef.detectChanges();
    if (this.post.text !== '' && this.runImageCheck()) {
      this.postService.createPost(this.currentArea.name, this.post.text, this.post.anonym, this.imageData, true, this.post.id).pipe(
        takeUntil(this.componentDestroyed))
        .subscribe(result => {
          if (!result.getError()) {
            this.postService.publishDraft(this.currentArea.name, this.post.id);
            this.post.text = '';
            this.snackBar.open('Post Created Successfully!', 'Close', {
              duration: 3000
            });
            this.router.navigate(['']);
          } else {
            this.errors = result.getError();
            this.loading = false;
          }
        });
    } else {
      this.loading = false;
      this.snackBar.open('You did not input anything or you have unsupported markdown', 'Close', {
        duration: 3000
      });
    }
  }

  runImageCheck(): boolean {
    this.cdRef.detectChanges();
    let valid = true;
    const linkMatch = this.getImageMatchesByGroup(1, this.post.text, C.WF_IMAGE_REGEX);
    const usedMarkdownIndexes: string[] = [];
    const invalidMatch = this.getImageMatchesByGroup(2, this.post.text, C.WF_IMAGE_REGEX);

    // Find duplicates and invalids
    if (linkMatch.length <= 4) {
      if (linkMatch.length > this.post.additional_images.length) {
        valid = false;
        this.snackBar.open(
          'This markdown does not work here',
           'Close', {
          duration: 3000
        });
      } else {
        for (let i = 0; i < invalidMatch.length; i++) {
          if (Number.parseInt(invalidMatch[i]) !== this.post.additional_images[i].num) {
            valid = false;
            this.snackBar.open(
              'This markdown does not work here',
               'Close', {
              duration: 3000
            });
          }
        }
      }
      for (let z = 0; z < linkMatch.length; z++) {
        if (valid) {
          if (usedMarkdownIndexes.indexOf(linkMatch[z]) !== -1) {
            valid = false;
            this.snackBar.open(
              'It appears as if you have duplicate image markdown, we do not allow this',
               'Close', {
              duration: 3000
            });
          } else {
            usedMarkdownIndexes.push(linkMatch[z]);
          }
        }
      }
    } else {
      valid = false;
      this.snackBar.open('You have to much image markdown in your text, the limit is 4', 'Close', {
        duration: 3000
      });
    }
    return valid;
  }
}
