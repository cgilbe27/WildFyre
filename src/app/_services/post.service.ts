
import {of, Observable } from 'rxjs';
import {mergeMap, catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Comment, CommentError } from '../_models/comment';
import { Image, ImageError } from '../_models/image';
import { Post, PostError } from '../_models/post';
import { SuperPost } from '../_models/superPost';
import { NavBarService } from './navBar.service';
import { HttpService } from './http.service';

@Injectable()
export class PostService {
  private queuedPosts: { [area: string]: Post[]; } = {};
  private used: { [area: string]: number[]; } = {};
  superPosts: { [area: string]: SuperPost; } = {};

  constructor(
    private httpService: HttpService,
    private navBarService: NavBarService
  ) { }

  private getPosts(area: string): Observable<Post[]> {
    return this.httpService.GET('/areas/' + area + '/?limit=10').pipe(
      map((response) => {
        const superPost: SuperPost = SuperPost.parse(response);
        const posts: Post[] = [];

        superPost.results.forEach((obj: any) => {
          posts.push(Post.parse(obj));
        });

        // Cache
        if (superPost.count !== 0) {
          this.queuedPosts[area] = posts;
          return posts;
        } else {
          return null;
        }
      }));
  }

  comment(area: string, post: Post, text: string): Observable<Comment> {
    post.subscribed = true;

    const body = {
      'text': text
    };

    return this.httpService.POST('/areas/' + area + '/' + post.id + '/', body).pipe(
      map((response) => {
        const comment = Comment.parse(response);

        post.comments.push(comment);
        return comment;
      }),
      catchError((err) => {
        return of(new CommentError(
          JSON.parse(err._body).non_field_errors,
          JSON.parse(err._body).text
        ));
      }),);
  }

  createPost(area: string, text: string, anonymous: boolean, image: string,
     draft: boolean = false, postID: number = null): Observable<Post> {
    let body: any;
    if (image === '') {
      image = null;
    }

    if (image === null) {
      body = {
        'anonym': anonymous,
        'text': text
      };
    } else {
      body = {
        'anonym': anonymous,
        'text': text,
        'image': image
      };
    }

    if (!draft && postID === null) {
        return this.httpService.POST('/areas/' + area + '/', body).pipe(
          map((response) => {
            return Post.parse(response);
          }),
          catchError((error) => {
            return of(new PostError(
              JSON.parse(error._body).non_field_errors,
              JSON.parse(error._body)._text
            ));
          }),);
      } else if (draft && postID === null) {
        return this.httpService.POST('/areas/' + area + '/drafts/', body).pipe(
          map((response) => {
            return Post.parse(response);
          }),
          catchError((error) => {
            return of(new PostError(
              JSON.parse(error._body).non_field_errors,
              JSON.parse(error._body)._text
            ));
          }),);
      } else if (draft && postID !== null) {
        return this.httpService.PATCH('/areas/' + area + '/drafts/' + postID + '/', body).pipe(
          map((response) => {
            return Post.parse(response);
          }),
          catchError((error) => {
            return of(new PostError(
              JSON.parse(error._body).non_field_errors,
              JSON.parse(error._body)._text
            ));
          }),);
      } else {
        throw new Error('Don\'t set postID, if not a draft');
      }
  }

  deleteImage(image: any, postID: number, area: string, text: string) {
    const body = {
      'image': image,
      'text': text
    };
    return this.httpService.PUT_IMAGE('/areas/' + area + '/drafts/' + postID +  '/', body).pipe(
      map((response) => {
        return Post.parse(response);
      }),catchError((err) => {
        return of(new PostError(
          JSON.parse(err._body).non_field_errors,
          JSON.parse(err._body).text
        ));
      }),);
  }

  deleteImages(postID: number, area: string, slot: number) {
    this.httpService.DELETE('/areas/' + area + '/drafts/' + postID +  '/img/' + slot.toString() + '/')
      .subscribe();
  }

  deletePost(area: string, postID: number, draft: boolean) {
    let url = '/areas/' + area + '/';

    if (draft === true) {
      url += 'drafts/';
    }

    this.httpService.DELETE(url + postID + '/')
      .subscribe();
  }

  getDrafts(area: string, limit: number, offset: number): Observable<SuperPost> {
      return this.httpService.GET('/areas/' + area + '/drafts/?limit=' + limit + '&offset=' + offset).pipe(
        map((response) => {
          this.superPosts[area] = SuperPost.parse(response);

          return this.superPosts[area];
      }));
  }

  getAllPosts(area: string): Observable<Post[]> {
    return of(this.queuedPosts[area]);
  }

  getNextPost(area: string): Observable<Post> {
    if (!this.used[area]) {
      this.used[area] = [];
    }

    if (!this.queuedPosts[area]) {
      this.queuedPosts[area] = [];
    }

    if (this.queuedPosts[area].length !== 0) {
      // Update stack and return first post
      const nextPost: Post = this.queuedPosts[area].pop();

      if (this.queuedPosts[area].length < 3) {
        this.getPosts(area)
          .subscribe();
      }

      if (this.used[area].indexOf(nextPost.id) === -1) {
        return of(nextPost);
      } else {
        return this.getNextPost(area);
      }
    } else {
      // Update queue
      return this.getPosts(area).pipe(
        mergeMap(result => {
        if (result !== null) {
          return this.getNextPost(area);
        } else {
          return of(null);
        }
      }));
    }
  }

  getOwnPosts(area: string, limit: number, offset: number): Observable<SuperPost> {
      return this.httpService.GET('/areas/' + area + '/own/?limit=' + limit + '&offset=' + offset).pipe(
        map((response) => {
          this.superPosts[area] = SuperPost.parse(response);

          return this.superPosts[area];
      }));
  }

  getPost(areaID: string, postID: number, draft: boolean = false): Observable<Post> {
    let url = '/areas/' + areaID + '/';

    if (draft === true) {
      url += 'drafts/';
    }

    return this.httpService.GET(url + postID + '/').pipe(
      map((response) => {
        return Post.parse(response);
      }));
  }

  publishDraft(area: string, postID: number): void {
    this.httpService.POST('/areas/' + area + '/drafts/' + postID + '/publish/', {})
      .subscribe();
  }

  setPicture(image: any, post: Post, area: string, draft: boolean = true, commentText: string = ''): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', image, image.name);
    if (draft) {
      formData.append('text', post.text);
      return this.httpService.PUT_IMAGE('/areas/' + area + '/drafts/' + post.id +  '/', formData).pipe(
        map((response) => {
          return Post.parse(response);
        }),catchError((err) => {
          return of(new PostError(
            JSON.parse(err._body).non_field_errors,
            JSON.parse(err._body).text
          ));
        }),);
    } else {
      formData.append('text', commentText);
      return this.httpService.POST_IMAGE('/areas/' + area + '/' + post.id +  '/', formData).pipe(
        map((response) => {
          return Comment.parse(response);
        }),catchError((err) => {
          return of(new CommentError(
            JSON.parse(err._body).non_field_errors,
            JSON.parse(err._body).text
          ));
        }),);
    }


  }

  setDraftPictures(image: any, post: Post, area: string, comment: string, slot: number): Observable<Image> {
    const formData: FormData = new FormData();
    formData.append('image', image, image.name);
    formData.append('comment', comment);
    return this.httpService.PUT_IMAGE('/areas/' + area + '/drafts/' + post.id + '/img/' + slot + '/', formData).pipe(
      map((response) => {
        return Image.parse(response);
      }),catchError((err) => {
        if (err.status === 404 || err.status === 0) {
          return of(null);
        }
        return of(new ImageError(
          JSON.parse(err._body).non_field_errors,
          JSON.parse(err._body).text
        ));
      }),);
  }

  spread(area: string, post: Post, spread: boolean): void {
    const body = {
      'spread': spread
    };

    this.used[area].push(post.id);

    this.httpService.POST('/areas/' + area +
      '/' + post.id + '/spread/', body)
        .subscribe();
  }

  subscribe(area: string, post: Post, subscribe: boolean): Observable<void> {
    post.subscribed = subscribe;

    const body = {
      'subscribed': subscribe
    };

    return this.httpService.PUT('/areas/' + area + '/' + post.id + '/subscribe/', body).pipe(
      map((response) => {
        if (subscribe) {
          console.log('You started following someone in the woods');
        } else {
          console.log('You left someone in the woods');
        }
      }));
  }
}
