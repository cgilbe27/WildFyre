import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  templateUrl: 'registerSuccess.component.html'
})
export class RegisterSuccessComponent implements OnInit {
  loading: boolean;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    // Reset login status
    this.authenticationService.logout();
  }

  letsGo() {
    this.router.navigate(['/login']);
  }
}
