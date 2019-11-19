import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NgModel, NgForm } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../_services/registration.service';
import { RecoverPasswordComponent } from './recoverPassword.component';

describe('RecoverPasswordComponent', () => {
    let comp: RecoverPasswordComponent;
    let fixture: ComponentFixture<RecoverPasswordComponent>;

    beforeEach(() => {
        const mdSnackBarStub = {
            open: () => ({})
        };
        const routerStub = {
            navigateByUrl: () => ({})
        };
        const activatedRouteStub = {
            params: {
                subscribe: () => ({})
            }
        };
        const registrationServiceStub = {
            recoverPasswordStep2: () => ({
                subscribe: () => ({})
            })
        };
        TestBed.configureTestingModule({
            declarations: [ RecoverPasswordComponent, NgForm, NgModel ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: MatSnackBar, useValue: mdSnackBarStub },
                { provide: Router, useValue: routerStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: RegistrationService, useValue: registrationServiceStub }
            ]
        });
        fixture = TestBed.createComponent(RecoverPasswordComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('loading defaults to: false', () => {
        expect(comp.loading).toEqual(false);
    });

    it('should create', inject([RegistrationService], (registrationService: RegistrationService) => {
      spyOn(registrationService, 'recoverPasswordStep2').and.returnValue({subscribe: () => {}});
      expect(comp).toBeTruthy();
    }));

});
