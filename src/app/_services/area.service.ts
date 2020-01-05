import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Area } from '../_models/area';
import { Reputation } from '../_models/reputation';
import { map, merge } from 'rxjs/operators';

@Injectable()
export class AreaService {
  public currentArea: BehaviorSubject<Area> = new BehaviorSubject(undefined);
  public currentReputation: BehaviorSubject<Reputation> = new BehaviorSubject(undefined);
  public areas: BehaviorSubject<Area[]> = new BehaviorSubject([]);
  public reputation: BehaviorSubject<{ [area: string]: Reputation; }> = new BehaviorSubject({});

  public constructor(
    private httpService: HttpService
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

  getAreaRep(areas: Area[]): void {
    this.reputation.subscribe(reputation => {
      let rep: Observable<any>[] = [];

      for (let i = 0; i < areas.length; i++) {
        if (reputation[areas[i].name] === undefined) {
          rep.push(this.httpService.GET('/areas/' + areas[i].name + '/rep/'));
        }
      }
      if (rep !== []) {
        forkJoin(rep).subscribe(({
          next: value => {
            let arr: { [area: string]: Reputation; } = {};

            for (let i = 0; i < value.length; i++) {
              arr[areas[i].name] = Reputation.parse(value[i])
            }

            this.currentReputation.next(arr[areas[0].name]);
            this.reputation.next(arr);
          }
        }));
      }
    });
  }

  getAreas(): void {
    // get areas from api
    this.areas.subscribe(areas => {
      if (areas.length === 0) {
        this.httpService.GET('/areas/')
          .subscribe(response => {
            for (let i = 0; i < response.length; i++) {
              let area = Area.parse(response[i]);
              areas.push(area)
            }

            this.getAreaRep(areas)
            this.areas.next(areas);
            this.currentArea.next(areas[0]);
          });
      }
    });
  }
}
