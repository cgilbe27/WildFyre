import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material';
import { HttpService } from './http.service';
import { RegistrationService } from './registration.service';
import { Observable } from 'rxjs';
import { RecoverTransaction } from '../_models/recoverTransaction';
import { Reset } from '../_models/reset';
import { Registration } from '../_models/registration';

describe('RegistrationService', () => {
  const recoverTransaction = {
    non_field_errors: "Error",
    username: "Test",
    email: "test@test.com",
    captcha: "jhsadbgfajh2234",
  };
  const reset = {
    non_field_errors: "Error",
    new_password: "password123",
    token: "dfgsdfgwqe45t",
    transaction: "3456345-34534-43534",
    captcha: "jhsadbgfajh2234",
  };

  const registration = {
    non_field_errors: "Error",
    username: "user123",
    email: "test@test.com",
    password: "password123",
    captcha: "jhsadbgfajh2234",
  };

  let service: RegistrationService;

  beforeEach(() => {
    const matSnackBarStub = {};
    const httpServiceStub = {
      POST_NO_TOKEN: () => ({ map: () => ({ catch: () => ({}) }) })
    };
    TestBed.configureTestingModule({
      providers: [
        RegistrationService,
        { provide: MatSnackBar, useValue: matSnackBarStub },
        { provide: HttpService, useValue: httpServiceStub }
      ]
    });
    service = TestBed.get(RegistrationService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  it('Expected values from first password step', () => {
    spyOn(service, 'recoverPasswordStep1').and.returnValue(new Observable<RecoverTransaction>());
    expect(service.recoverPasswordStep1(recoverTransaction.email, recoverTransaction.username, recoverTransaction.captcha)).toEqual(new Observable<RecoverTransaction>());
  });

  it('Expected values from second password step', () => {
    spyOn(service, 'recoverPasswordStep2').and.returnValue(new Observable<Reset>());
    expect(service.recoverPasswordStep2(reset.new_password, reset.token, reset.transaction, reset.captcha)).toEqual(new Observable<Reset>());
  });

  it('Expected values from recover username', () => {
    spyOn(service, 'recoverUsername').and.returnValue(new Observable<RecoverTransaction>());
    expect(service.recoverUsername(recoverTransaction.email, recoverTransaction.captcha)).toEqual(new Observable<RecoverTransaction>());
  });

  it('Expected values from registration', () => {
    spyOn(service, 'register').and.returnValue(new Observable<Registration>());
    expect(service.register(registration.username, registration.email , registration.password , registration.captcha )).toEqual(new Observable<Registration>());
  });
});
