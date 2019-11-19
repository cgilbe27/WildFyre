import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { Account } from '../_models/account';
import { Author } from '../_models/author';
import { PasswordError } from '../_models/password';
import { AuthenticationService } from '../_services/authentication.service';
import { ProfileService } from '../_services/profile.service';

@Component({
  template: `
  <h1 mat-dialog-title>Change Password</h1>
  <div class="alert alert-info">
    Passwords must contain at least 8 characters and be alphanumeric (At least 1 letter and 1 number)
  </div>
  <div *ngIf="errors && errors._text" class="help-block">
    <ul *ngFor="let err of errors._text">
      <li>{{err}}</li>
    </ul>
  </div>
  <form name="form" id="change-password-form" (ngSubmit)="f.form.valid && submitEditPassword()" #f="ngForm" novalidate>
    <div *ngIf="errors && errors.non_field_errors" class="alert alert-danger">
      <ul *ngFor="let err of errors.non_field_errors">
        <li>{{err}}</li>
      </ul>
    </div>

    <input placeholder="Username" type="hidden" name="username" [value]="author.name"
      [(ngModel)]="author.name" #username="ngModel" autocomplete="on" readonly />

    <div class="form" [ngClass]="{ 'has-error': f.submitted && (!oldPassword.valid || (errors && errors._oldPassword)) }">
      <mat-input-container>
        <input matInput placeholder="Old Password" type="password" name="oldPassword"
          [(ngModel)]="model.oldPassword" #oldPassword="ngModel" autocomplete="current-password" required />
      </mat-input-container>
      <div *ngIf="f.submitted && !oldPassword.valid" class="help-block">Password is required</div>
      <div *ngIf="errors && errors._oldPassword" class="help-block">
        <ul *ngFor="let err of errors._oldPassword">
          <li>{{err}}</li>
        </ul>
      </div>
    </div>

    <div class="form" [ngClass]="{ 'has-error': f.submitted && (!newPassword1.valid || (errors && errors._newPassword1)) }">
      <mat-input-container>
        <input matInput placeholder="New Password" type="password" name="newPassword1"
          [(ngModel)]="model.newPassword1" #newPassword1="ngModel" autocomplete="new-password" required />
      </mat-input-container>
      <div *ngIf="f.submitted && !newPassword1.valid" class="help-block">Password is required</div>
      <div *ngIf="errors && errors._newPassword1" class="help-block">
        <ul *ngFor="let err of errors._newPassword1">
          <li>{{err}}</li>
        </ul>
      </div>
    </div>

    <div class="form" [ngClass]="{ 'has-error': f.submitted && (!newPassword2.valid || (errors && errors._newPassword2)) }">
      <mat-input-container>
        <input matInput placeholder="New Password (repeat)" type="password" name="newPassword2"
          [(ngModel)]="model.newPassword2" #newPassword2="ngModel" autocomplete="new-password" required />
      </mat-input-container>
      <div *ngIf="f.submitted && !newPassword2.valid" class="help-block">Password is required</div>
      <div *ngIf="errors && errors._newPassword2" class="help-block">
        <ul *ngFor="let err of errors._newPassword2">
          <li>{{err}}</li>
        </ul>
      </div>
    </div>
  </form>
  <div mat-dialog-actions>
    <button mat-button (click)="submitEditPassword()">Change Password</button>
    <button mat-button mat-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
  </div>
  `
})
export class PasswordDialogComponent implements OnDestroy {
  account: Account;
  author: Author;
  componentDestroyed: Subject<boolean> = new Subject();
  errors: PasswordError;
  model: any = {};

  constructor(
    public dialogRef: MatDialogRef<PasswordDialogComponent>,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private profileService: ProfileService,
    ) { }

    ngOnDestroy() {
      this.componentDestroyed.next(true);
      this.componentDestroyed.complete();
    }

    submitEditPassword() {
      this.authenticationService.login(this.account.username, this.model.oldPassword)
        .takeUntil(this.componentDestroyed)
        .subscribe(result => {
          if (!result.getError()) {
            if (this.model.newPassword1 === this.model.newPassword2) {
              this.profileService.setPassword(this.model.newPassword1)
                .takeUntil(this.componentDestroyed)
                .subscribe(result2 => {
                  if (!result2.getError()) {
                    this.authenticationService.login(this.account.username, this.model.newPassword1)
                      .takeUntil(this.componentDestroyed)
                      .subscribe(result3 => {
                        if (!result3.getError()) {
                          this.model.oldPassword = '';
                          this.model.newPassword1 = '';
                          this.model.newPassword2 = '';
                          this.returnInformation(true);
                        } else {
                          this.snackBar.open('Error could not set token', 'Close');
                        }
                      });
                  } else {
                    this.errors = result2.getError();
                    this.snackBar.open('You did not follow the requirements', 'Close');
                  }
              });

            } else {
              this.errors = result.getError();
              this.snackBar.open('Your new passwords do not match', 'Close');
            }
          } else {
            this.errors = result.getError();
            this.snackBar.open('This is not your current password', 'Close');
          }
      });
      }

    returnInformation(bool: boolean) {
      const message = {
        'bool': bool
      };

      this.dialogRef.close(message);
    }
}
