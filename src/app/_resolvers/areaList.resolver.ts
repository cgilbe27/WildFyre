import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Area } from '../_models/area';
import { AreaService } from '../_services/area.service';

@Injectable()
export class AreaListResolver implements Resolve<Observable<Area[]>> {
  constructor(
    private areaService: AreaService
  ) {}

  resolve() { // route: ActivatedRouteSnapshot) {
    // route.paramMap.get('id')
    return this.areaService.getAreas();
  }
}
