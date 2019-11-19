import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AvatarDialogComponent } from '../_dialogs/avatar.dialog.component';
import { BioDialogComponent } from '../_dialogs/bio.dialog.component';
import { EmailDialogComponent } from '../_dialogs/email.dialog.component';
import { PasswordDialogComponent } from '../_dialogs/password.dialog.component';
import { Account } from '../_models/account';
import { Author } from '../_models/author';
import { Ban } from '../_models/ban';
import { Choice } from '../_models/choice';
import { SuperBan } from '../_models/superBan';
import { AuthenticationService } from '../_services/authentication.service';
import { ProfileService } from '../_services/profile.service';
import { ReasonService } from '../_services/reason.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {
  account: Account;
  author: Author;
  choices: Choice[];
  componentDestroyed: Subject<boolean> = new Subject();
  data: any;
  index = 1;
  limit = 2;
  loading = true;
  model: any = {};
  offset = 2;
  url: string;
  self: boolean;
  bans: Ban[] = [];
  totalCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private profileService: ProfileService,
    private reasonService: ReasonService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.reasonService.getFlagReasons()
      .takeUntil(this.componentDestroyed)
      .subscribe((choices) => {
        this.choices = choices;
      });
    this.routeService.resetRoutes();
    this.route.params
      .takeUntil(this.componentDestroyed)
      .subscribe((parms) => {
        if (parms['id']) {
          this.profileService.getUser(parms['id'])
            .takeUntil(this.componentDestroyed)
            .subscribe((user: Author) => {
              this.self = false;
              this.author = user;
          });
        } else {
          this.self = true;

          this.profileService.getSelf()
            .takeUntil(this.componentDestroyed)
            .subscribe((self: Author) => {
              this.author = self;
              this.model.bio = this.author.bio;
            });

          this.profileService.getAccount()
            .takeUntil(this.componentDestroyed)
            .subscribe((self: Account) => {
              this.account = self;
              this.model.email = this.account.email;
            });

          this.profileService.getBans(this.limit, (this.index * this.limit) - this.limit)
            .takeUntil(this.componentDestroyed)
            .subscribe((superBan: SuperBan) => {
              superBan.results.forEach((obj: any) => {
                this.bans.push(Ban.parse(obj));
              });
              this.totalCount = superBan.count;
              this.cdRef.detectChanges();
            });

        }
    });

    this.profileService.getAccount()
      .takeUntil(this.componentDestroyed)
      .subscribe((self: Account) => {
        this.account = self;
        this.model.email = this.account.email;
        this.self = true;
    });
    this.loading = false;
  }

  ngOnDestroy() {
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  getBans(page: number) {
    this.loading = true;
    this.bans = [];

    this.profileService.getBans(this.limit, (this.offset * page) - this.limit)
      .takeUntil(this.componentDestroyed)
      .subscribe(superBan => {

        superBan.results.forEach((obj: any) => {
          this.bans.push(Ban.parse(obj));
        });

        this.index = page;
        this.totalCount = superBan.count;
        this.cdRef.detectChanges();
        this.loading = false;
    });
  }

  getReason(number: number): string {
    if (number !== null) {
      return this.choices[number].value;
    } else {
      return this.choices[3].value;
    }
  }

  openBioDialog() {
    const dialogRef = this.dialog.open(BioDialogComponent);
    dialogRef.componentInstance.model.bio = this.author.bio;
    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.bool) {
          this.profileService.setBio(this.author, result.bio)
            .takeUntil(this.componentDestroyed)
            .subscribe();
          const snackBarRef = this.snackBar.open('Bio changed successfully', 'Close', {
            duration: 3000
          });
        }
      });
  }

  openEmailDialog() {
    const dialogRef = this.dialog.open(EmailDialogComponent);
    dialogRef.componentInstance.model.email = this.account.email;
    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.bool) {
          this.profileService.setEmail(result.email)
            .takeUntil(this.componentDestroyed)
            .subscribe();
          const snackBarRef = this.snackBar
            .open('We just sent you a verification email, you must verify your email for it to be set', 'Close', {
            duration: 3000
          });
        }
      });
  }

  openPasswordDialog() {
    const dialogRef = this.dialog.open(PasswordDialogComponent);
    dialogRef.componentInstance.account = this.account;
    dialogRef.componentInstance.author = this.author;
    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.bool) {
          const snackBarRef = this.snackBar.open('Password changed successfully', 'Close', {
            duration: 3000
          });
        }
      });
  }

  openPictureDialog() {
    const dialogRef = this.dialog.open(AvatarDialogComponent);
    dialogRef.componentInstance.author = this.author;
    dialogRef.afterClosed()
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (result.bool) {
          if (result.profilePicture) {
          this.profileService.setProfilePicture(result.profilePicture)
            .takeUntil(this.componentDestroyed)
            .subscribe(result2 => {
              if (!result2.getError()) {
              this.author.avatar = result2.avatar;
            } else {
              const snackBarRef = this.snackBar.open('Your image file must be below 512KiB in size', 'Close', {
                duration: 3000
              });
            }
            });
          } else {
            const snackBarRef = this.snackBar.open('You did not select a valid image file', 'Close', {
              duration: 3000
            });
          }
        }
      });
  }

    viewProfile() {
      this.routeService.addNextRoute(this.router.url);
      this.router.navigateByUrl('/user/' + this.author.user);
    }
  }
