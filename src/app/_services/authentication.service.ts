import {of, Observable } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth, AuthError} from '../_models/auth';
import { Login } from '../_models/login';

@Injectable()
export class AuthenticationService {
  private apiURL: string;
  public token: Auth = null;

  constructor(
    private http: HttpClient
  ) {
    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser !== null) {
      this.token = Auth.parse(currentUser);
    }
    this.apiURL = 'https://api.wildfyre.net';
    // if (isDevMode()) {
    //   this.apiURL = 'http://localhost:8000';
    // }
  }

  login(login: Login): Observable<Auth> {
    if (this.token !== null) {
      return of(this.token);
    } else {
      const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };

      return this.http.post(this.apiURL + '/account/auth/', JSON.stringify(login), options).pipe(
        map((response: any) => {
          // set token property
          this.token = Auth.parse(response);
          // store username and token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({ username: login.username, token: this.token.token }));

          return Auth.parse(response);
        }),
        catchError((error: any) => {
          const body = error.error;
          return of(
            new AuthError(
              body.non_field_errors,
              body.detail,
              body.username,
              body.password
            )
          );
        }));
    }
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
