import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Area } from '../_models/area';
import { Reputation } from '../_models/reputation';

@Injectable()
export class VariableService {
  public currentArea: Subject<Area>;
  public currentRepution: Subject<Reputation>;
  public areas: Subject<Area[]>;
  public repution: Subject<{ [area: string]: Reputation; }>;

  public constructor() { }
}
