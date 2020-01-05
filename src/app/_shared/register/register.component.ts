import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../../_services/authentication.service';
import { NavBarService } from '../../_services/navBar.service';
import { NotificationService } from '../../_services/notification.service';
import { RegistrationService } from '../../_services/registration.service';
import { RouteService } from '../../_services/route.service';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { Login } from '../../_models/login';
import { Auth, AuthError } from '../../_models/auth';

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
    private navBarService: NavBarService,
    private notificationService: NotificationService,
    private registrationService: RegistrationService,
    private routeService: RouteService
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

  back() {
    if (this.routeService.routes.length === 0) {
      this.router.navigateByUrl('');
    } else {
      this.router.navigateByUrl(this.routeService.getNextRoute());
    }
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
              this.authenticationService.login(new Login(this.registerForm.controls.usernamer.value, this.registerForm.controls.passwordr.value)).pipe(
                takeUntil(this.componentDestroyed))
                .subscribe((result: Auth) => {
                  if (!result.getError()) {
                    this.navBarService.loggedIn.next(true);
                    this.router.navigate(['/']);
                    this.submitted = false;
                  } else {
                    this.errors = result.getError();
                    this.submitted = false;
                  }
              });
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
