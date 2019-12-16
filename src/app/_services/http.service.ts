import {throwError,  Observable } from 'rxjs';
import {catchError} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class HttpService {
  private apiURL: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) {
    this.apiURL = 'https://api.wildfyre.net';
    // if (isDevMode()) {
    //   this.apiURL = 'http://localhost:8000';
    // }
  }
  // HTTP Requests
  DELETE(passedUrl: string): Observable<void> {
    // DELETE to api
    return this.http.delete(this.apiURL + passedUrl, this.getOptions()).pipe(
      catchError((error: any) => this.handleError(error)));
  }

  GET(passedUrl: string): Observable<any> {
    // get GET from api
    return this.http.get(this.apiURL + passedUrl, this.getOptions()).pipe(
      catchError((error: any) => this.handleError(error)));
  }

  OPTIONS(passedUrl: string): Observable<any> {
    // OPTIONS to api
    return this.http.options(this.apiURL + passedUrl, this.getOptions()).pipe(
      catchError((error: any) => this.handleError(error)));
  }

  PATCH(passedUrl: string, body: any): Observable<any> {
    // PATCH to api
    return this.http.patch(this.apiURL + passedUrl, JSON.stringify(body), this.getOptions()).pipe(
      catchError((error: any) => this.handleError(error)));
  }

  POST(passedUrl: string, body: any): Observable<any> {
    // POST to api
    return this.http.post(this.apiURL + passedUrl, JSON.stringify(body), this.getOptions()).pipe(
      catchError((error: any) => this.handleError(error)));
  }

  POST_IMAGE(passedUrl: string, body: any): Observable<any> {
    // POST to api
    return this.http.post(this.apiURL + passedUrl, body, this.getOptionsForImage()).pipe(
      catchError((error: any) => this.handleError(error)));
  }

  POST_NO_TOKEN(passedUrl: string, body: any): Observable<any> {
    // POST to api without an Authorization header
    return this.http.post(this.apiURL + passedUrl, body, this.getOptionsNoToken()).pipe(
      catchError((error: any) => this.handleError(error)));
  }

  PUT(passedUrl: string, body: any): Observable<any> {
    // PUT to api
    return this.http.put(this.apiURL + passedUrl, JSON.stringify(body), this.getOptions()).pipe(
      catchError((error: any) => this.handleError(error)));
  }

  PUT_IMAGE(passedUrl: string, body: any): Observable<any> {
    // PUT to api
    return this.http.put(this.apiURL + passedUrl, body, this.getOptionsForImage()).pipe(
      catchError((error: any) => this.handleError(error)));
  }

  // Handling methods
  private handleError(error: any): Observable<any> {
    console.error(error);

    let message: string;
    let action = 'Close';
    let onAction: Function;

    if (!navigator.onLine) {
      this.snackBar.open('Your internet appears to be down', action, {
        duration: 20000
      });
    }

    switch (error.status) {
      // 4xx Client errors
      case 401:
        message = 'Authentication required.';
        action = 'Login';

        const router = this.router;
        onAction = function() {
          router.navigate(['/login']);
        };
        break;
      case 403:
        message = 'You are not allowed to do this!';
        break;
      case 404:
        message = 'The server couldn\'t find the resource you requested.';
        break;
      case 408:
        message = 'Request timed out.';
        break;

      // Errors that indicate bugs
      case 405:
      case 410:
      case 411:
      case 415:
      case 431:
      case 505:
        message = 'Oops, an error occured! Please submit a bug report';
        action = 'Report!';
        onAction = function() {
          location.href = 'mailto:bugs@wildfyre.net';
        };
        break;

      // 5xx Server errors
      case 500:
        message = 'Fatal error on our end. We are already notified!';
        break;
      case 503:
        message = 'Service unavailable. Updating / Overloaded.';
        break;

      default:
        return throwError(error);
    }

    // Show snack Snackbar
    const snackBarRef = this.snackBar.open(message, action, {
      duration: 5000
    });

    if (onAction != null) {
      snackBarRef.onAction().subscribe(() => { onAction(); });
    }

    // Throw the Observable for the request
    return throwError(error);
  }

  getOptions(): any {
    const header: { [name: string]: string | string[]; } = {};
    header['Content-Type'] = 'application/json';
    console.log(this.authenticationService.token.token)
    if (this.authenticationService.token.token) {
      header['Authorization'] = `Token ${this.authenticationService.token.token}`;
    }

    return { headers: new HttpHeaders(header) };
  }

  getOptionsForImage(): any {
    return { headers: new HttpHeaders({ 'Authorization': `Token ${this.authenticationService.token.token}`}) };
  }

  getOptionsNoToken(): any {
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  }
}
