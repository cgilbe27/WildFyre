import {of, Observable } from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Account, AccountError } from '../_models/account';
import { Author, AuthorError } from '../_models/author';
import { SuperBan } from '../_models/superBan';
import { HttpService } from './http.service';

@Injectable()
export class ProfileService {
  private account: Account;
  private self: Author;
  private superBans: SuperBan;
  private userArray: Author[] = [];

  constructor(
    private httpService: HttpService
  ) {}

  getAccount(): Observable<Account> {
    if (this.account) {
      return of(this.account);
    } else {
    return this.httpService.GET('/account/').pipe(
      map((response) => {
        this.account = Account.parse(response); // cache
        return this.account;
      }));
    }
  }

  getBans(limit: number, offset: number): Observable<SuperBan> {
    return this.httpService.GET('/bans/?limit=' + limit + '&offset=' + offset).pipe(
      map((response) => {
        this.superBans = SuperBan.parse(response); // cache
        return this.superBans;
      }));
  }

  getSelf(): Observable<Author> {
    if (this.self) {
      return of(this.self);
    } else {
      return this.httpService.GET('/users/').pipe(
        map((response) => {
          this.self = Author.parse(response);  // cache
          return this.self;
        }));
    }
  }

  getUser(id: string): Observable<Author> {
    if (this.userArray[Number(id)]) {
      return of(this.userArray[Number(id)]);
    } else {
    return this.httpService.GET(`/users/${id}/`).pipe(
      map((response) => {
        this.userArray[Number(id)] = Author.parse(response); // cache
        return this.userArray[Number(id)];
      }));
    }
  }

  setBio(author: Author, bio: any): Observable<Author> {
    author.bio = bio;

    const body = {
      bio: bio
    };

    return this.httpService.PATCH('/users/', body).pipe(
      map((response) => {
        console.log('You leveled up some stats');

        return Author.parse(response);
      }),
      catchError((error: any) => {
        const body = error.error;
        return of(
          new AuthorError(
            body.non_field_errors,
            body.detail,
            body.avatar,
            body.bio
          )
        );
      }));
  }

  setEmail(email: any): Observable<Account> {
    const body = {
      email: email
    };

    return this.httpService.PATCH('/account/', body).pipe(
      map((response) => {
        console.log('You have mail!');

        return Account.parse(response);
      }),
      catchError((error: any) => {
        const body = error.error;
        return of(
          new AccountError(
            body.non_field_errors,
            body.detail,
            body.username,
            body.email
          )
        );
      }));
  }

  setPassword(password: any): Observable<Account> {
    const body = {
      password: password
    };

    return this.httpService.PATCH('/account/', body).pipe(
      map((response) => {
        console.log('You have been securely encryptified');

        return Account.parse(response);
      }),
      catchError((error: any) => {
        const body = error.error;
        return of(
          new AccountError(
            body.non_field_errors,
            body.detail,
            body.username,
            body.email
          )
        );
      }));
  }

  setProfilePicture(image: any): Observable<Author> {
     const formData: FormData = new FormData();
     formData.append('avatar', image, image.name);

    return this.httpService.PUT_IMAGE('/users/', formData).pipe(
      map((response) => {
        console.log('You looked in the mirror and got frightened');
        return Author.parse(response);
      }),
      catchError((error: any) => {
        const body = error.error;
        return of(
          new AuthorError(
            body.non_field_errors,
            body.detail,
            body.avatar,
            body.bio
          )
        );
      }));
  }
}
