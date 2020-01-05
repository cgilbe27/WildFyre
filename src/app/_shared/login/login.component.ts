import {takeUntil} from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../_services/authentication.service';
import { NavBarService } from '../../_services/navBar.service';
import { NotificationService } from '../../_services/notification.service';
import { RouteService } from '../../_services/route.service';
import { Login } from '../../_models/login';
import { Auth, AuthError } from '../../_models/auth';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  componentDestroyed: Subject<boolean> = new Subject();
  errors: AuthError;
  loading = true;
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private navBarService: NavBarService,
    private notificationService: NotificationService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    // reset login status
    this.routeService.resetRoutes();
    this.authenticationService.logout();

    this.loginForm = new FormGroup({
      'usernamel': new FormControl(''),
      'passwordl': new FormControl(''),
    });

    console.log('Turning up the heat');
    this.loading = false;
  }

  ngOnDestroy() {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  login() {
    this.errors = null;
    this.submitted = true;

    if (this.loginForm.valid) {
      this.authenticationService.login(new Login(this.loginForm.controls.usernamel.value, this.loginForm.controls.passwordl.value)).pipe(
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
      this.snackBar.open('Your information is incorrect', 'Close', {
        duration: 3000
      });
      this.submitted = false;
    }
  }
}
