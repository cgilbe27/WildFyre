import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Area } from '../_models/area';
import { Reputation } from '../_models/reputation';
import { Auth } from '../_models/auth';

@Injectable()
export class VariableService {
  public auth: BehaviorSubject<Auth> = new BehaviorSubject(undefined);
  public currentArea: BehaviorSubject<Area> = new BehaviorSubject(undefined);
  public currentRepution: BehaviorSubject<Reputation> = new BehaviorSubject(undefined);
  public areas: BehaviorSubject<Area[]> = new BehaviorSubject(undefined);
  public repution: BehaviorSubject<{ [area: string]: Reputation; }> = new BehaviorSubject(undefined);

  public constructor() { }
}
