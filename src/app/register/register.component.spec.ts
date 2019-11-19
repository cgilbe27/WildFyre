import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { RegistrationService } from '../_services/registration.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
    let comp: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;

    beforeEach(() => {
        const routerStub = {
            navigate: () => ({})
        };
        const authenticationServiceStub = {
            logout: () => ({})
        };
        const registrationServiceStub = {
            register: () => ({
                subscribe: () => ({})
            })
        };
        TestBed.configureTestingModule({
            declarations: [ RegisterComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: routerStub },
                { provide: AuthenticationService, useValue: authenticationServiceStub },
                { provide: RegistrationService, useValue: registrationServiceStub }
            ],
            imports: [ FormsModule, MatSnackBarModule ]
        });
        fixture = TestBed.createComponent(RegisterComponent);
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

    it('should create', inject([RegistrationService], (registrationService: RegistrationService) => {
      spyOn(registrationService, 'register').and.returnValue({subscribe: () => {}});
      expect(comp).toBeTruthy();
    }));

});
