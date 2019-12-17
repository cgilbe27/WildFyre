import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Author } from '../_models/author';
import { PostService } from '../_services/post.service';

@Injectable()
export class CreatePostResolver implements Resolve<void> {
  constructor(
    private postService: PostService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    // this.profileService.getAccount();
    // this.profileService.getBans(10, 0);
    // this.profileService.getSelf();

    // if (route.paramMap.get('id') !== null) {
    //   this.profileService.getUser(route.paramMap.get('id'))
    // }

    if (route.paramMap.get('area') !== null) {
      this.postService.getDrafts(route.paramMap.get('area'), 10, 0);
    }
  }
}
