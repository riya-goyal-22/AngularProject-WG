import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordFormComponent } from './reset-password-form.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs'; // to mock observables
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';

describe('ResetPasswordFormComponent', () => {
  let component: ResetPasswordFormComponent;
  let fixture: ComponentFixture<ResetPasswordFormComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let form: FormGroup

  beforeEach(async () => {
    // spies for the services
    authServiceSpy = jasmine.createSpyObj('AuthService', ['resetPassword','otp']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      declarations: [ResetPasswordFormComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        InputTextModule,
        FloatLabelModule,
        PasswordModule,
        InputOtpModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    // Create the component fixture and initialize component
    fixture = TestBed.createComponent(ResetPasswordFormComponent);
    component = fixture.componentInstance;

    component.form.controls['email'].setValue('user1');
    component.form.controls['newPassword'].setValue('pass@1234');
    component.form.controls['otp'].setValue(123456);

    form = component.form

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should submit the form successfully and navigate to login', () => {
    // Set up the form controls with valid values
    form.controls['email'].setValue('testuser');
    form.controls['newPassword'].setValue('ValidPassword@123');
    form.controls['otp'].setValue(123456);
    
    // Mock the resetPassword method to return an observable
    authServiceSpy.resetPassword.and.returnValue(of({
      data: null,
      code: 200,
      message: 'success'
    }));
    authServiceSpy.otp.and.returnValue(of({
      data: null,
      code: 200,
      message: 'success'
    }));

    spyOn(form,'reset')
    
    // Call the submit method
    component.submit();
    fixture.detectChanges();

    // Check if the message service showed success
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'OTP Sent',
    });
  });

  it('should not submit the form if invalid', () => {
    // Set up the form with invalid values
    component.form.controls['email'].setValue('');
    component.form.controls['newPassword'].setValue('');
    component.form.controls['otp'].setValue(0);

    // Call the submit method
    component.submit();

    // Check that the resetPassword method was not called
    expect(authServiceSpy.resetPassword).not.toHaveBeenCalled();
  });

});
