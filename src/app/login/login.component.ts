
import {takeUntil} from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { NavBarService } from '../_services/navBar.service';
import { NotificationService } from '../_services/notification.service';
import { RouteService } from '../_services/route.service';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  componentDestroyed: Subject<boolean> = new Subject();
  errors: string;
  loading = false;
  model: any = {};

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private navBarService: NavBarService,
    private notificationService: NotificationService,
    private routeService: RouteService
  ) {
    this.snackBar.open('Authentication Required', 'Close', {
      duration: 3000
    });
  }

  ngOnInit() {
    // reset login status
    this.routeService.resetRoutes();
    this.authenticationService.logout();

    console.log('Turning up the heat');
  }

  ngOnDestroy() {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(result => {
        if (!result.getError()) {
          this.notificationService.getSuperNotification(10, 0).pipe(
            takeUntil(this.componentDestroyed))
            .subscribe(superNotification => {
              this.navBarService.notifications.next(superNotification.count);
          });
          this.navBarService.loggedIn.next(true);
          this.navBarService.areaVisible.next(true);
          this.router.navigate(['/']);
          this.loading = false;
        }
    }, err  => {
      this.errors = 'Unable to log in with provided credentials.';
      this.loading = false;
    });
  }
}
