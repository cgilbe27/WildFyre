import {of, Observable, BehaviorSubject } from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Account, AccountError } from '../_models/account';
import { Author, AuthorError } from '../_models/author';
import { SuperBan } from '../_models/superBan';
import { HttpService } from './http.service';

@Injectable()
export class ProfileService {
  public account: BehaviorSubject<Account> = new BehaviorSubject(undefined);
  public self: BehaviorSubject<Author> = new BehaviorSubject(undefined);
  public superBans: BehaviorSubject<SuperBan> = new BehaviorSubject(undefined);
  public userArray: BehaviorSubject<Author[]> = new BehaviorSubject([]);

  constructor(
    private httpService: HttpService
  ) {}

  getAccount() {
    this.account.subscribe(account => {
      if (account === undefined) {
        this.httpService.GET('/account/')
          .subscribe(response => {
            this.account.next(Account.parse(response));
          });
      }
    });
  }

  getBans(limit: number, offset: number) {
    this.superBans.subscribe(superBans => {
      if (superBans === undefined) {
        this.httpService.GET('/bans/?limit=' + limit + '&offset=' + offset)
          .subscribe(response => {
            this.superBans.next(SuperBan.parse(response));
          });
      }
    });
  }

  getSelf() {
    this.self.subscribe(self => {
      this.httpService.GET('/users/')
        .subscribe(response => {
          if (self === undefined) {
            this.self.next(Author.parse(response));
          }
        });
    });
  }

  getUser(id: string) {
    this.userArray.subscribe(userArray => {
      if (userArray[Number(id)] === undefined) {
        this.httpService.GET(`/users/${id}/`)
        .subscribe(response => {
          userArray[Number(id)] = Author.parse(response)
          this.userArray.next(userArray);
        });
      }
    });
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
