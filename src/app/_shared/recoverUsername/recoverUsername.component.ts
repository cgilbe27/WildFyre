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
  templateUrl: 'recoverUsername.component.html',
  styleUrls: ['./recoverUsername.component.scss']
})
export class RecoverUsernameComponent implements OnInit, OnDestroy {
  @ViewChild(ReCaptchaComponent, {static: false}) captcha: ReCaptchaComponent;

  componentDestroyed: Subject<boolean> = new Subject();
  errors: any;
  loading = false;
  recoverUsernameForm: FormGroup;
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
    this.recoverUsernameForm = new FormGroup({
      'emailru': new FormControl(''),
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

  recoverUsername() {
    this.errors = null;
    this.submitted = true;

    if (this.recoverUsernameForm.valid) {
      this.registrationService.recoverUsername(this.recoverUsernameForm.controls.emailru.value, this.token).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (!result.getError()) {
          this.snackBar.open('We will contact you via the information provided', 'Close', {
            duration: 3000
          });
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
}
