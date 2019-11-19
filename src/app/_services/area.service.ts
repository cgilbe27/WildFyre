import {of, Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from './http.service';
import { Area } from '../_models/area';
import { Reputation } from '../_models/reputation';

@Injectable()
export class AreaService {
  public areas: Area[];
  public currentAreaName = '';
  public isAreaChecked = false;
  private reputation: { [area: string]: Reputation; } = { };

  public constructor(
    private httpService: HttpService
  ) { }

  getAreaRep(area: string): Observable<Reputation> {
    if (this.reputation[area]) {
      return of(this.reputation[area]);
    } else {
      return this.httpService.GET('/areas/' + area + '/rep/').pipe(
        map((response: Response) => {
          this.reputation[area] = Reputation.parse(response);
          return this.reputation[area];
        }));
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
        this.currentAreaName = this.areas[0].name;
        return areas;
      }));
    } else {
      return of(this.areas);
    }
  }
}
