import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ViewChild } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { RegistrationService } from '../../_services/registration.service';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  @ViewChild(ReCaptchaComponent, {static: false}) captcha: ReCaptchaComponent;

  componentDestroyed: Subject<boolean> = new Subject();
  errors: any;
  loading = true;
  registerForm: FormGroup;
  token: any;
  submitted = false;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private authenticationService: AuthenticationService,
    private registrationService: RegistrationService
  ) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'usernamer': new FormControl(''),
      'emailr': new FormControl(''),
      'passwordr': new FormControl(''),
      'password2r': new FormControl(''),
    });

    // Reset login status
    this.authenticationService.logout();
    this.loading = false;
  }

  ngOnDestroy() {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  register() {
    this.errors = null;
    this.submitted = true;

    if (this.registerForm.valid) {
      if (this.registerForm.controls.passwordr.value === this.registerForm.controls.password2r.value) {
        this.registrationService.register(
          this.registerForm.controls.usernamer.value,
          this.registerForm.controls.emailr.value,
          this.registerForm.controls.passwordr.value,
          this.token).pipe(
          takeUntil(this.componentDestroyed))
          .subscribe(result => {
            if (!result.getError()) {
              this.router.navigate(['/register/success']);
              this.submitted = false;
            } else {
              this.errors = result.getError();
              this.submitted = false;
            }
        });
      } else {
        this.snackBar.open('Your passwords do not match', 'Close', {
          duration: 3000
        });
        this.submitted = false;
      }
    } else {
      this.snackBar.open('Your information is incorrect', 'Close', {
        duration: 3000
      });
      this.submitted = false;
    }
  }

  setCaptchaResponse(res: any) {
    this.token = this.captcha.getResponse();
  }
}
