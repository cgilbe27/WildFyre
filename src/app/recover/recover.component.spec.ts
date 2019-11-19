import { ComponentFixture, TestBed, inject  } from '@angular/core/testing';
import { NgModel, NgForm } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { RegistrationService } from '../_services/registration.service';
import { RecoverComponent } from './recover.component';

describe('RecoverComponent', () => {
    let comp: RecoverComponent;
    let fixture: ComponentFixture<RecoverComponent>;

    beforeEach(() => {
        const mdSnackBarStub = {
            open: () => ({})
        };
        const routerStub = {
            navigateByUrl: () => ({})
        };
        const registrationServiceStub = {
            recoverPasswordStep1: () => ({
                subscribe: () => ({})
            }),
            recoverUsername: () => ({
                subscribe: () => ({})
            })
        };
        TestBed.configureTestingModule({
            declarations: [ RecoverComponent, NgForm, NgModel ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: MatSnackBar, useValue: mdSnackBarStub },
                { provide: Router, useValue: routerStub },
                { provide: RegistrationService, useValue: registrationServiceStub }
            ]
        });
        fixture = TestBed.createComponent(RecoverComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('loading defaults to: false', () => {
        expect(comp.loading).toEqual(false);
    });

    it('should create', inject([RegistrationService], (registrationService: RegistrationService) => {
      spyOn(registrationService, 'recoverPasswordStep1').and.returnValue({subscribe: () => {}});
      expect(comp).toBeTruthy();
    }));

    it('should create', inject([RegistrationService], (registrationService: RegistrationService) => {
      spyOn(registrationService, 'recoverUsername').and.returnValue({subscribe: () => {}});
      expect(comp).toBeTruthy();
    }));

});
