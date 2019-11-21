import {takeUntil} from 'rxjs/operators';
import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { AreaService } from './_services/area.service';
import { AuthenticationService } from './_services/authentication.service';
import { NavBarService } from './_services/navBar.service';
import { Angulartics2Piwik } from 'angulartics2/piwik';

@Component({
  selector: 'app-component',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnDestroy {
  componentDestroyed: Subject<boolean> = new Subject();
  loading = true;

  constructor(
    private cdRef: ChangeDetectorRef,
    private areaService: AreaService,
    private authenticationService: AuthenticationService,
    private navBarService: NavBarService,
    private angulartics2Piwik: Angulartics2Piwik
  ) {
      this.angulartics2Piwik.startTracking();

      if (this.authenticationService.token != null) {
        this.areaService.getAreas().pipe(
          takeUntil(this.componentDestroyed))
          .subscribe(result => {
            this.loading = false;
            this.cdRef.detectChanges();
          });
      } else {
        this.navBarService.areaVisible.next(false);
        this.loading = false;
      }

      window.onbeforeunload = function () {
        window.scrollTo(0, 0);
      }
  }

  ngOnDestroy() {
    this.cdRef.detach();
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }
}
