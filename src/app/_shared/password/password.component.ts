import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Account } from '../../_models/account';
import { AuthenticationService } from '../../_services/authentication.service';
import { ProfileService } from '../../_services/profile.service';
import { RouteService } from '../../_services/route.service';
import { Login } from '../../_models/login';

@Component({
  templateUrl: 'password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit, OnDestroy {
  account: Account;
  componentDestroyed: Subject<boolean> = new Subject();
  errors: any;
  loading = true;
  passwordForm: FormGroup;
  self: boolean;

  constructor(
    public snackBar: MatSnackBar,
    private router: Router,
    private authenticationService: AuthenticationService,
    private profileService: ProfileService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.passwordForm = new FormGroup({
      'oldPassword': new FormControl(''),
      'password': new FormControl(''),
      'password2': new FormControl(''),
    });
    this.loading = false;
  }

  ngOnDestroy() {
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

  changePassword() {
    this.loading = true;

    if (this.passwordForm.valid) {
      this.authenticationService.login(new Login(String(this.account.username), this.passwordForm.controls.oldPassword.value)).pipe(
        takeUntil(this.componentDestroyed))
        .subscribe(result => {
          if (!result.getError()) {
            if (this.passwordForm.controls.password.value === this.passwordForm.controls.password2.value) {
              this.profileService.setPassword(this.passwordForm.controls.password.value).pipe(
                takeUntil(this.componentDestroyed))
                .subscribe(result2 => {
                  if (!result2.getError()) {
                    this.authenticationService.login(new Login(String(this.account.username), this.passwordForm.controls.password.value)).pipe(
                      takeUntil(this.componentDestroyed))
                      .subscribe(result3 => {
                        if (!result3.getError()) {
                          this.loading = false;
                          this.passwordForm.controls.oldPassword.setValue('');
                          this.passwordForm.controls.password.setValue('');
                          this.passwordForm.controls.password2.setValue('');
                          this.snackBar.open('Password changed successfully', 'Close', {
                            duration: 3000
                          });
                        } else {
                          this.loading = false;
                          this.snackBar.open('Error could not set token', 'Close', {
                            duration: 3000
                          });
                        }
                      });
                  } else {
                    this.errors = result2.getError();
                    this.loading = false;
                    this.snackBar.open('You did not follow the requirements', 'Close', {
                      duration: 3000
                    });
                  }
              });

            } else {
              this.loading = false;
              this.snackBar.open('Your new passwords do not match', 'Close', {
                duration: 3000
              });
            }
          } else {
            this.errors = result.getError();
            this.loading = false;
            this.snackBar.open('This is not your current password', 'Close', {
              duration: 3000
            });
          }
        });
    } else {
      this.loading = false;
      this.snackBar.open('Your information is incorrect', 'Close', {
        duration: 3000
      });
    }
  }
}
