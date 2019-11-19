import { By } from '@angular/platform-browser';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { MarkedPipe } from '../_pipes/marked.pipe';
import { MatIconModule, MatSnackBar, MatMenuModule, MatProgressSpinnerModule, MatCardModule, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { Account } from '../_models/account';
import { Author } from '../_models/author';
import { AuthenticationService } from '../_services/authentication.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';
import { ReasonService } from '../_services/reason.service';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ngx-img-cropper';
import { NgxPaginationModule } from 'ngx-pagination';


describe('ProfileComponent', () => {
    let comp: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
        const mdDialogStub = {
            open: () => ({
                afterClosed: () => ({
                    subscribe: () => ({})
                })
            })
        };
        const mdSnackBarStub = {
            open: () => ({})
        };
        const routerStub = {};
        const activatedRouteStub = {
          params: Observable.of({'id': 1})
        };
        const authenticationServiceStub = {
          token: 'token'
        };
        const reasonServiceStub = {}
        const profileServiceStub = {
          getUser: (id: number) => {
            if (id !== 1) {
              throw new Error('Requests for users other than with Id 1 not implemented');
            }

            return Observable.of(
              new Author(1, 'Test User', null, 'test', false)
            );
          },
            getSelf: () => {
              return Observable.of(
                new Author(1, 'Test User', null, 'test', false)
              );
            },
            getAccount: () => {
              return Observable.of(
                new Account(1, 'Test User', 'test@test.com')
              );
            },
            setBio: () => ({
                subscribe: () => ({})
            }),
            setEmail: () => ({
                subscribe: () => ({})
            }),
            setPassword: () => ({
                subscribe: () => ({})
            })
        };
        const routeServiceStub = {
            addNextRoute: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [ ProfileComponent, MarkedPipe, NgModel, NgForm, ImageCropperComponent ],
            providers: [
                { provide: MatDialog, useValue: mdDialogStub },
                { provide: MatSnackBar, useValue: mdSnackBarStub },
                { provide: Router, useValue: routerStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: AuthenticationService, useValue: authenticationServiceStub },
                { provide: ProfileService, useValue: profileServiceStub },
                { provide: ReasonService, useValue: reasonServiceStub },
                { provide: RouteService, useValue: routeServiceStub },
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ],
            imports: [ MatIconModule, MatMenuModule, MatProgressSpinnerModule, MatCardModule, NgxPaginationModule ],
        });
        fixture = TestBed.createComponent(ProfileComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement.query(By.css('#name'));
        el = de.nativeElement;
    });

    it('should set the author name', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        expect(el.textContent).toBe('Test User');
      });
    }));

    it('should set bio', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('#bio')).nativeElement.textContent).toBe('test\n');
      });
    }));

    it('should set id', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('#userID')).nativeElement.textContent).toBe('ID: 1');
      });
    }));

    it('should set email', async(() => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#email')).nativeElement.textContent).toBe('test@test.com');
      });
    }));

});
