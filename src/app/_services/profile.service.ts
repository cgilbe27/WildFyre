import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Account, AccountError } from '../_models/account';
import { Author, AuthorError } from '../_models/author';
import { Profile, ProfileError } from '../_models/profile';
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
      return Observable.of(this.account);
    } else {
    return this.httpService.GET('/account/')
      .map((response: Response) => {
        this.account = Account.parse(response); // cache
        return this.account;
      });
    }
  }

  getBans(limit: number, offset: number): Observable<SuperBan> {
    return this.httpService.GET('/bans/?limit=' + limit + '&offset=' + offset)
      .map((response: Response) => {
        this.superBans = SuperBan.parse(response); // cache
        return this.superBans;
      });
  }

  getSelf(): Observable<Author> {
    if (this.self) {
      return Observable.of(this.self);
    } else {
      return this.httpService.GET('/users/')
        .map((response: Response) => {
          this.self = Author.parse(response);  // cache
          return this.self;
        });
    }
  }

  getUser(id: string): Observable<Author> {
    if (this.userArray[Number(id)]) {
      return Observable.of(this.userArray[Number(id)]);
    } else {
    return this.httpService.GET(`/users/${id}/`)
      .map((response: Response) => {
        this.userArray[Number(id)] = Author.parse(response); // cache
        return this.userArray[Number(id)];
      });
    }
  }

  setBio(author: Author, bio: any): Observable<Author> {
    author.bio = bio;

    const body = {
      bio: bio
    };

    return this.httpService.PATCH('/users/', body)
      .map((response: Response) => {
        console.log('You leveled up some stats');

        return Author.parse(response);
      }).catch((err) => {
        return Observable.of(new AuthorError(
          JSON.parse(err._body).non_field_errors,
          JSON.parse(err._body).text
        ));
      });
  }

  setEmail(email: any): Observable<Account> {
    const body = {
      email: email
    };

    return this.httpService.PATCH('/account/', body)
      .map((response: Response) => {
        console.log('You have mail!');

        return Account.parse(response);
      }).catch((err) => {
        return Observable.of(new AccountError(
          JSON.parse(err._body).non_field_errors,
          JSON.parse(err._body).text
        ));
      });
  }

  setPassword(password: any): Observable<Account> {
    const body = {
      password: password
    };

    return this.httpService.PATCH('/account/', body)
      .map((response: Response) => {
        console.log('You have been securely encryptified');

        return Account.parse(response);
      }).catch((err) => {
        return Observable.of(new AccountError(
          JSON.parse(err._body).non_field_errors,
          JSON.parse(err._body).text
        ));
      });
  }

  setProfilePicture(image: any): Observable<Profile> {
     const formData: FormData = new FormData();
     formData.append('avatar', image, image.name);

    return this.httpService.PUT_IMAGE('/users/', formData)
      .map((response: Response) => {
        console.log('You looked in the mirror and got frightened');
        return Profile.parse(response);
      }).catch((err) => {
        return Observable.of(new ProfileError(
          JSON.parse(err._body).non_field_errors,
          JSON.parse(err._body).text
        ));
      });
  }
}
