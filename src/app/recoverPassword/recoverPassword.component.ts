import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ViewChild } from '@angular/core';
import { ResetError } from '../_models/reset';
import { RegistrationService } from '../_services/registration.service';
import { ReCaptchaComponent } from 'angular2-recaptcha';

@Component({
  templateUrl: 'recoverPassword.component.html'
})
export class RecoverPasswordComponent implements OnInit, OnDestroy {
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  componentDestroyed: Subject<boolean> = new Subject();
  errors: ResetError;
  loading = false;
  model: any = {};
  token: any;
  transactionID: string;

  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private registrationService: RegistrationService
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.transactionID = params['trans'];
    });
  }

  ngOnDestroy() {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  resetPassword() {
    if (this.model.password === this.model.password2) {
    this.registrationService.recoverPasswordStep2(this.model.password, this.model.token, this.transactionID, this.token)
      .takeUntil(this.componentDestroyed)
      .subscribe(result => {
        if (!result.getError()) {
          const snackBarRef = this.snackBar.open('Your new password is now set', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl('login');
          this.loading = false;
          this.model.password = '';
          this.model.password2 = '';
          this.model.token = '';
          this.captcha.reset();
        } else {
          const snackBarRef = this.snackBar.open('You inputted something incorrectly', 'Close', {
            duration: 3000
          });
          this.errors = result.getError();
          this.loading = false;
          this.captcha.reset();
        }
      });
    } else {
      const snackBarRef = this.snackBar.open('Your passwords did not match', 'Close', {
        duration: 3000
      });
      this.model.password = '';
      this.model.password2 = '';
    }
  }

  setCaptchaResponse(res: any) {
    this.token = res;
  }
}
