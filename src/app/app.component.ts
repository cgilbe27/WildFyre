import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
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
    private angulartics2Piwik: Angulartics2Piwik
  ) {
      this.angulartics2Piwik.startTracking();
      this.loading = false;

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
