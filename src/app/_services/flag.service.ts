import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { Comment } from '../_models/comment';
import { HttpService } from './http.service';
import { Post } from '../_models/post';

enum TypeOfReport {
  Post,
  Comment
}

@Injectable()
export class FlagService implements OnDestroy {
  componentDestroyed: Subject<boolean> = new Subject();
  public currentComment: Comment;
  public currentPost: Post;

  constructor(
    private snackBar: MatSnackBar,
    private httpService: HttpService
  ) { }

  ngOnDestroy() {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  sendFlagReport(typeOfFlagReport: TypeOfReport, report: string, key: string, currentArea: string) {
    let type: string;
    if (!key) {
      key = null;
    }

    const body = {
      'reason': key,
      'comment': report
    };

    switch (typeOfFlagReport) {
      case TypeOfReport.Post:
      this.httpService.POST('/areas/' + currentArea + '/' + this.currentPost.id + '/flag/', body)
        .subscribe();
        type = 'Post';
        break;
      case TypeOfReport.Comment:
      this.httpService.POST('/areas/' + currentArea + '/' + this.currentPost.id + '/' + this.currentComment.id + '/flag/', body)
        .subscribe();
        type = 'Comment';
        break;
    }

    this.snackBar.open(type + ' Flag Report Successful', 'Close', {
      duration: 2000
    });
  }
}
