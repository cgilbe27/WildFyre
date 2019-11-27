import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AreaService } from '../_services/area.service';

@Injectable()
export class AreaListResolver implements Resolve<void> {
  constructor(
    private areaService: AreaService
  ) {}

  resolve() {
    this.areaService.getAreas();
  }
}
