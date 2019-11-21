import {of, Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { VariableService } from './variable.service';
import { Area } from '../_models/area';
import { Reputation } from '../_models/reputation';

@Injectable()
export class AreaService {
  public currentArea: Area;
  public currentReputation: Reputation;
  public areas: Area[];
  public reputation: { [area: string]: Reputation; } = { };


  public constructor(
    private httpService: HttpService,
    private variableService: VariableService
  ) { }

  // getArea(s: string): Observable<Area> {
  //   if (s === '_') {
  //     return of(new Area('_', 'All Posts', 0, 0));
  //   }

  //   if (!this.areas) {
  //     return this.getAreas().pipe(
  //       map(areas => {
  //         if (areas) {
  //           for (let i = 0; i < areas.length; i++) {
  //             if (areas[i].name === s) {
  //               return areas[i];
  //             }
  //           }
  //         }
  //       }));
  //   } else {
  //     for (let i = 0; i < this.areas.length; i++) {
  //       if (this.areas[i].name === s) {
  //         return of(this.areas[i]);
  //       }
  //     }
  //   }
  // }

  getAreaRep(area: string): Observable<Reputation> {
    if (!this.reputation[area]) {
      return this.httpService.GET('/areas/' + area + '/rep/').pipe(
        map((response) => {
          this.reputation[area] = Reputation.parse(response);

          this.variableService.currentRepution.next(this.reputation[area]);
          this.variableService.repution.next(this.reputation);

          return this.reputation[area];
        }));
    } else {
      this.variableService.repution.next(this.reputation);

      return of(this.reputation[area]);
    }
  }

  getAreas(): Observable<Area[]> {
    // get areas from api
    if (!this.areas) {
      return this.httpService.GET('/areas/').pipe(
        map(response => {
          const areas: Area[] = [];

          for (let i = 0; i < response.length; i++) {
            areas.push(Area.parse(response[i]))
          }

          this.areas = areas;
          this.variableService.areas.next(this.areas);
          this.variableService.currentArea.next(this.areas[0]);

          return areas;
        }));
    } else {
      this.variableService.areas.next(this.areas);

      return of(this.areas);
    }
  }
}
