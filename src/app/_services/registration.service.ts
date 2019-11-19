import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Registration, RegistrationError } from '../_models/registration';
import { Reset, ResetError } from '../_models/reset';
import { RecoverTransaction, RecoverTransactionError } from '../_models/recoverTransaction';
import { HttpService } from './http.service';

@Injectable()
export class RegistrationService {
  constructor(
    private snackBar: MatSnackBar,
    private httpService: HttpService
  ) { }

  recoverPasswordStep1(email: string, username: string, captchaResponse: String): Observable<RecoverTransaction> {
    const body = {
      'email': email,
      'username': username,
      'captcha': captchaResponse
    };

    return this.httpService.POST_NO_TOKEN('/account/recover/', body).pipe(
      map((response) => {
        // Step 1 successful
        return RecoverTransaction.parse(response);
      }),
      catchError((error: { non_field_errors: string[]; email: string[]; captcha: string[]; }) => {
        return of(
          new RecoverTransactionError(
            error.non_field_errors,
            error.email,
            error.captcha
          )
        );
      }));
  }

  recoverPasswordStep2(password: string, token: string, transactionID: string, captchaResponse: String): Observable<Reset> {
    const body = {
      'new_password': password,
      'token': token,
      'transaction': transactionID,
      'captcha': captchaResponse
    };

    return this.httpService.POST_NO_TOKEN('/account/recover/reset/', body).pipe(
      map((response) => {
        // Password reset successful
        return Reset.parse(response);
      }),
      catchError((error: { non_field_errors: string[]; new_password: string[]; token: string[]; transaction: string[]; captcha: string[]; }) => {
        return of(
          new ResetError(
            error.non_field_errors,
            error.new_password,
            error.token,
            error.transaction,
            error.captcha
          )
        );
      }));
  }

  recoverUsername(email: string, captchaResponse: String) {
    const body = {
      'email': email,
      'captcha': captchaResponse
    };

    return this.httpService.POST_NO_TOKEN('/account/recover/', body).pipe(
      map((response) => {
        // Usernames sent successfully
        return RecoverTransaction.parse(response);
      }),
      catchError((error: { non_field_errors: string[]; username: string[]; email: string[]; captcha: string[]; }) => {
        return of(
          new RecoverTransactionError(
            error.non_field_errors,
            error.username,
            error.email,
            error.captcha
          )
        );
      }));
  }

  register(username: string, email: string, password: string, captchaResponse: String): Observable<Registration> {
    const body = {
      'username': username,
      'email': email,
      'password': password,
      'captcha': captchaResponse
    };

    return this.httpService.POST_NO_TOKEN('/account/register/', body).pipe(
      map((response) => {
        // Registration successful
        return Registration.parse(response);
      }),
      catchError((error: { error: { non_field_errors: string[]; username: string[]; email: string[]; password: string[]; captcha: string[]; }; }) => {
        return of(
          new RegistrationError(
            error.error.non_field_errors,
            error.error.username,
            error.error.email,
            error.error.password,
            error.error.captcha
          )
        );
      }));
  }
}
