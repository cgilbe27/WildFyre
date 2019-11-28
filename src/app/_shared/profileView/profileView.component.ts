import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ShareDialogComponent } from '../../_dialogs/share.dialog.component';
import { Author } from '../../_models/author';
import { Link } from '../../_models/link';
import { NavBarService } from '../../_services/navBar.service';
import { ProfileService } from '../../_services/profile.service';
import { RouteService } from '../../_services/route.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: 'profileView.component.html',
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  author: Author;
  componentDestroyed: Subject<boolean> = new Subject();

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private navBarService: NavBarService,
    private profileService: ProfileService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((params: { [x: string]: any; }) => {
        const id = params['id'];

        // Get post from secure api end point
        this.profileService.userArray.pipe(
          takeUntil(this.componentDestroyed))
          .subscribe(author => {
            this.author =  author[id];
        });
    });
  }

  ngOnDestroy() {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  back() {
    if (this.routeService.routes.length === 0) {
      this.router.navigateByUrl('');
    } else {
      this.router.navigateByUrl(this.routeService.getNextRoute());
    }
  }

  share() {
    this.navBarService.link.next(
      new Link('https://client.wildfyre.net/user/' + this.author.user,
      String(this.author.bio).slice(0, 100),
      this.author.name
    ));
    const dialogRef = this.dialog.open(ShareDialogComponent);
    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyed))
      .subscribe(() => { });
  }
}
