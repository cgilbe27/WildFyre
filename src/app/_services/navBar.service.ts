import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Area } from '../_models/area';
import { CommentData } from '../_models/commentData';
import { Link } from '../_models/link';

@Injectable()
export class NavBarService {
  clearInputs: BehaviorSubject<boolean> = new BehaviorSubject(false);
  comment: BehaviorSubject<CommentData> = new BehaviorSubject(new CommentData('', null));
  currentArea: BehaviorSubject<Area> = new BehaviorSubject(new Area('', ''));
  hasPost: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isVisibleSource: BehaviorSubject<string> = new BehaviorSubject('');
  link: BehaviorSubject<Link> = new BehaviorSubject(new Link('', '', ''));
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  notifications: BehaviorSubject<number> = new BehaviorSubject(0);

  public constructor() { }
}
