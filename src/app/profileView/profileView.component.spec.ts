import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileViewComponent } from './profileView.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { ProfileService } from '../_services/profile.service';
import { RouteService } from '../_services/route.service';
import { MatCardModule, MatDialogModule, MatIconModule } from '@angular/material';
import { MarkedPipe } from '../_pipes/marked.pipe';
import { Author } from '../_models/author';
import { NavBarService } from '../_services/navBar.service';

describe('ProfileViewComponent', () => {
  let comp: ProfileViewComponent;
  let fixture: ComponentFixture<ProfileViewComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    // stubs
    const activatedRouteStub = {
      params: Observable.of({'id': 1})
    };
    const routerStub = {};
    const authenticationServiceStub = {
      token: 'token'
    };
    const profileServiceStub = {
      getUser: (id: number) => {
        if (id !== 1) {
          throw new Error('Requests for users other than with Id 1 not implemented');
        }

        return Observable.of(
          new Author(1, 'Test User', null, 'test', false)
        );
      }
    };
    const navBarServiceStub = {};
    const routeServiceStub = {};

    TestBed.configureTestingModule({
      declarations: [ ProfileViewComponent, MarkedPipe ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerStub },
        { provide: AuthenticationService, useValue: authenticationServiceStub },
        { provide: ProfileService, useValue: profileServiceStub },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: NavBarService, useValue: navBarServiceStub }
      ],
      imports: [ MatCardModule, MatDialogModule, MatIconModule ],
    });

    fixture = TestBed.createComponent(ProfileViewComponent);
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

});
