import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class RouteService {
  routes: string[] = [];

  public constructor(
    private router: Router
  ) { }

  addNextRoute(route: string) {
    this.routes[this.routes.length] = route;
  }

  addNextRouteByIndex(index: number) {
    if (this.router.url.lastIndexOf('/') > 0) {
      this.routes[this.routes.length] = this.router.url.slice(0, this.router.url.lastIndexOf('/')) + '/' + index;
    } else {
      this.routes[this.routes.length] = this.router.url + '/' + index;
    }
  }

  deleteLastRoute() {
    this.routes = this.routes.splice(this.routes.length, 1);
  }

  getNextRoute(): string {
    const route = this.routes[this.routes.length - 1];
    this.deleteLastRoute();
    return route;
  }

  resetRoutes() {
    this.routes = [];
  }
}
