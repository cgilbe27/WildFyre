import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule } from '@angular/material';
import { Response, ResponseOptions, ResponseOptionsArgs } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth} from '../_models/auth';
import { Author } from '../_models/author';
import { Comment } from '../_models/comment';
import { Notification } from '../_models/notification';
import { NotificationPost } from '../_models/notificationPost';
import { SuperNotification } from '../_models/superNotification';
import { Post } from '../_models/post';
import { AuthenticationService } from '../_services/authentication.service';
import { NavBarService } from '../_services/navBar.service';
import { NotificationService } from '../_services/notification.service';
import { RouteService } from '../_services/route.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let comp: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(() => {
        const routerStub = {
            navigate: () => ({})
        };
        const navBarServiceStub = {};
        const authenticationServiceStub = {
            logout: () => ({}),
            login: () => ({
                subscribe: () => {
                  return Observable.of(Auth.parse(new Response(new ResponseOptions({
                    body: JSON.stringify({name: 'Bob', surname : 'Jones'})
                  }))));
                }
            })
        };
        const routeServiceStub = {
            resetRoutes: () => ({})
        };
        const notificationServiceStub = {
            getSuperNotifications: () => {
              return Observable.of(
                new SuperNotification(1, '', '',
                  new Array<Notification>(
                    new Notification('', 
                      new NotificationPost(0, 
                        new Author(0, '', '', '', false), 'test'), 
                          new Array<number>(0)))
              ));
            }
        };
        TestBed.configureTestingModule({
            declarations: [ LoginComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: routerStub },
                { provide: AuthenticationService, useValue: authenticationServiceStub },
                { provide: NavBarService, useValue: navBarServiceStub },
                { provide: NotificationService, useValue: notificationServiceStub },
                { provide: RouteService, useValue: routeServiceStub }
            ],
            imports: [ FormsModule, MatSnackBarModule, BrowserAnimationsModule ]
        });
        fixture = TestBed.createComponent(LoginComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('loading defaults to: false', () => {
        expect(comp.loading).toEqual(false);
    });

    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            const authenticationServiceStub = fixture.debugElement.injector.get(AuthenticationService);
            spyOn(authenticationServiceStub, 'logout');
            comp.ngOnInit();
            expect(authenticationServiceStub.logout).toHaveBeenCalled();
        });
    });

    it('should create', inject([AuthenticationService], (authenticationService: AuthenticationService) => {
      spyOn(authenticationService, 'login').and.returnValue({subscribe: () => {}});
      expect(comp).toBeTruthy();
    }));

});
