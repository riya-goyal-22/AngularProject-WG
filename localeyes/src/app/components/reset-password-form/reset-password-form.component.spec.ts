import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordFormComponent } from './reset-password-form.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs'; // to mock observables
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';

describe('ResetPasswordFormComponent', () => {
  let component: ResetPasswordFormComponent;
  let fixture: ComponentFixture<ResetPasswordFormComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let form: FormGroup

  beforeEach(async () => {
    // spies for the services
    authServiceSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      declarations: [ResetPasswordFormComponent],
      imports: [
        ReactiveFormsModule,
        InputTextModule,
        FloatLabelModule,
        PasswordModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
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

    component.form.controls['username'].setValue('user1');
    component.form.controls['newPassword'].setValue('pass@1234');
    component.form.controls['securityAnswer'].setValue('answer');

    form = component.form

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should submit the form successfully and navigate to login', () => {
    // Set up the form controls with valid values
    form.controls['username'].setValue('testuser');
    form.controls['newPassword'].setValue('ValidPassword@123');
    form.controls['securityAnswer'].setValue('SomeSecurityAnswer');
    
    // Mock the resetPassword method to return an observable
    authServiceSpy.resetPassword.and.returnValue(of({
      data: null,
      code: 200,
      message: 'success'
    }));

    spyOn(form,'reset')
    
    // Call the submit method
    component.submit();
    fixture.detectChanges();

    // Check if the resetPassword method was called
    expect(authServiceSpy.resetPassword).toHaveBeenCalledWith({
      username: 'testuser',
      new_password: 'ValidPassword@123',
      security_answer: 'SomeSecurityAnswer'
    });

    // Check if the form was reset
    expect(form.reset).toHaveBeenCalled();

    // Check if the router navigate method was called
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);

    // Check if the message service showed success
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Successfully updated password',
    });
  });

  it('should not submit the form if invalid', () => {
    // Set up the form with invalid values
    component.form.controls['username'].setValue('');
    component.form.controls['newPassword'].setValue('');
    component.form.controls['securityAnswer'].setValue('');

    // Call the submit method
    component.submit();

    // Check that the resetPassword method was not called
    expect(authServiceSpy.resetPassword).not.toHaveBeenCalled();
  });

});
