import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Author } from '../_models/author';
import { ProfileService } from '../_services/profile.service';

@Injectable()
export class ProfileResolver implements Resolve<Observable<Author>> {
  constructor(
    private profileService: ProfileService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    if (route.paramMap.get('id') !== undefined) {
      return this.profileService.getUser(route.paramMap.get('id'));
    }
  }
}
