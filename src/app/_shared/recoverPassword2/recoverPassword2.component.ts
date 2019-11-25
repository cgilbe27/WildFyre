import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ViewChild } from '@angular/core';
import { RegistrationService } from '../../_services/registration.service';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { takeUntil } from 'rxjs/operators';
import { RouteService } from '../../_services/route.service';

@Component({
  templateUrl: 'recoverPassword2.component.html',
  styleUrls: ['./recoverPassword2.component.scss']
})
export class RecoverPassword2Component implements OnInit, OnDestroy {
  @ViewChild(ReCaptchaComponent, {static: false}) captcha: ReCaptchaComponent;

  componentDestroyed: Subject<boolean> = new Subject();
  errors: any;
  loading = true;
  recoverPasswordForm2: FormGroup;
  model: any = {};
  token: any;
  transactionID: string;
  submitted = false;
  resetTransaction: string;

  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private registrationService: RegistrationService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.recoverPasswordForm2 = new FormGroup({
      'tokenrp2': new FormControl(''),
      'passwordrp2': new FormControl(''),
      'password2rp2': new FormControl(''),
    });

    this.route.params.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((params: { [x: string]: string; }) => {
        this.transactionID = params['trans'];
        this.loading = false;
    });
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

  resetPassword() {
    this.errors = null;
    this.submitted = true;

    if (this.recoverPasswordForm2.valid) {
      if (this.recoverPasswordForm2.controls.passwordrp2.value === this.recoverPasswordForm2.controls.password2rp2.value) {
        this.registrationService.recoverPasswordStep2(
          this.recoverPasswordForm2.controls.passwordrp2.value,
          this.recoverPasswordForm2.controls.tokenrp2.value,
          this.resetTransaction,
          this.token).pipe(
          takeUntil(this.componentDestroyed))
          .subscribe(result => {
            if (!result.getError()) {
              this.snackBar.open('Your new password is now set', 'Close', {
                duration: 3000
              });
              this.router.navigateByUrl('login');
              this.captcha.reset();
              this.submitted = false;
            } else {
              this.snackBar.open('You inputted something incorrectly', 'Close', {
                duration: 3000
              });
              this.errors = result.getError();
              this.captcha.reset();
              this.submitted = false;
            }
          });
        } else {
          this.snackBar.open('Your passwords did not match', 'Close', {
            duration: 3000
          });
          this.submitted = true;
        }
    } else {
      this.snackBar.open('Your information is incorrect', 'Close', {
        duration: 3000
      });
      this.submitted = true;
    }
  }

  setCaptchaResponse(res: any) {
    this.token = res;
  }
}
