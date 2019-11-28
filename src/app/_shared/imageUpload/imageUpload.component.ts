import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Author } from '../../_models/author';
import { ProfileService } from '../../_services/profile.service';
import { RouteService } from '../../_services/route.service';

declare const Compressor: any;

@Component({
  templateUrl: 'imageUpload.component.html',
  styleUrls: ['./imageUpload.component.scss']
})
export class ImageUploadComponent implements OnInit, OnDestroy {
  author: Author;
  componentDestroyed: Subject<boolean> = new Subject();
  errors: any;
  loading = true;

  constructor(
    private cdRef: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private router: Router,
    private profileService: ProfileService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.profileService.self.pipe(
    takeUntil(this.componentDestroyed))
    .subscribe((self: Author) => {
      this.author = self;
      this.loading = false;
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


  uploadImage() {
    const self = this;
    const file = (<HTMLInputElement>document.getElementById('imageUpload-upload')).files[0];
    const file2: any = new Compressor(file, {
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
      convertSize: 500000,
      success(result: Blob) {
        self.uploadImg(result);
      }
    });
  }

  uploadImg(r: Blob) {
    this.profileService.setProfilePicture(r).pipe(
      takeUntil(this.componentDestroyed))
      .subscribe((result2: Author)  => {
        if (!result2.getError()) {
          this.author.avatar = `${result2.avatar}`;
          this.cdRef.detectChanges();
        } else {
          this.errors = result2.getError();
          this.loading = false;
        }
      });
  }
}
