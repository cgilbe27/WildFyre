import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ViewChild } from '@angular/core';
import { RegistrationService } from '../../_services/registration.service';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { takeUntil } from 'rxjs/operators';
import { RouteService } from '../../_services/route.service';

@Component({
  templateUrl: 'recoverPassword.component.html',
  styleUrls: ['./recoverPassword.component.scss']
})
export class RecoverPasswordComponent implements OnInit, OnDestroy {
  @ViewChild(ReCaptchaComponent, {static: false}) captcha: ReCaptchaComponent;

  componentDestroyed: Subject<boolean> = new Subject();
  errors: any;
  loading = false;
  recoverPasswordForm: FormGroup;
  model: any = {};
  token: any;
  submitted = false;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private registrationService: RegistrationService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.recoverPasswordForm = new FormGroup({
      'emailrp': new FormControl(''),
      'usernamerp': new FormControl(''),
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

  recoverPassword() {
    this.errors = null;
    this.submitted = true;

    if (this.recoverPasswordForm.valid) {
      this.registrationService.recoverPasswordStep1(
        this.recoverPasswordForm.controls.emailrp.value,
        this.recoverPasswordForm.controls.usernamerp.value,
        this.token).pipe(
        takeUntil(this.componentDestroyed))
        .subscribe(result => {
          if (!result.getError()) {
            this.routeService.addNextRoute('/recover/password');
            this.router.navigateByUrl('/recover/password/' + result.transaction);
            this.submitted = false;
          } else {
            this.errors = result.getError();
            this.submitted = false;
          }
        });
    } else {
      this.snackBar.open('Your information is incorrect', 'Close', {
        duration: 3000
      });
      this.submitted = false;
    }
  }

  setCaptchaResponse(res: any) {
    this.token = res;
  }
}
