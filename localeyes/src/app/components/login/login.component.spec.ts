import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';
import { DataService } from '../../services/data.service';
import { InvalidCredentials, InactiveAccount } from '../../constants/errors';
import { CustomResponse } from '../../modals/modals';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    // Create spies for all services
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login'], {
      isUserLogin: { set: jasmine.createSpy('set') },
      isAdminLogin: { set: jasmine.createSpy('set') },
      token: ''
    });
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['adminLogin']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['someMethod']);
    dataServiceSpy = jasmine.createSpyObj('DataService', [], {
      loadingSubject: { next: jasmine.createSpy('next') }
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: DataService, useValue: dataServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('username')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.form;
    expect(form.valid).toBeFalsy();
    
    form.controls['username'].setValue('testuser');
    expect(form.controls['username'].valid).toBeTruthy();
    expect(form.valid).toBeFalsy(); // still false because password is empty
    
    form.controls['password'].setValue('123'); // too short
    expect(form.controls['password'].valid).toBeFalsy();
    
    form.controls['password'].setValue('123456'); // valid length
    expect(form.controls['password'].valid).toBeTruthy();
    expect(form.valid).toBeTruthy();
  });

  describe('Admin Login', () => {
    beforeEach(() => {
      component.form.setValue({
        username: 'admin',
        password: 'password123'
      });
    });

    it('should successfully login as admin', fakeAsync(() => {
      const mockResponse = { data: 'admin-token' , message: 'Success', code: 200};
      adminServiceSpy.adminLogin.and.returnValue(of(mockResponse));

      component.login();
      tick();

      expect(dataServiceSpy.loadingSubject.next).toHaveBeenCalledWith(true);
      expect(dataServiceSpy.loadingSubject.next).toHaveBeenCalledWith(false);
      expect(authServiceSpy.isAdminLogin.set).toHaveBeenCalledWith(true);
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'success',
        detail: 'Successful login'
      });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
      expect(localStorage.getItem('token')).toBe('admin-token');
      expect(localStorage.getItem('role')).toBe('admin');
    }));

    it('should handle invalid admin credentials', fakeAsync(() => {
      const errorResponse = {
        error: { message: InvalidCredentials }
      };
      adminServiceSpy.adminLogin.and.returnValue(throwError(() => errorResponse));

      component.login();
      tick();

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'Invalid Credentials'
      });
      expect(component.form.value).toEqual({ username: null, password: null });
    }));
  });

  describe('User Login', () => {
    beforeEach(() => {
      component.form.setValue({
        username: 'user',
        password: 'password123'
      });
    });

    it('should successfully login as user', fakeAsync(() => {
      const mockResponse = {data: 'user-token', code: 200, message: 'success'}
      authServiceSpy.login.and.returnValue(of(mockResponse));

      component.login();
      tick();

      expect(dataServiceSpy.loadingSubject.next).toHaveBeenCalledWith(true);
      expect(authServiceSpy.isUserLogin.set).toHaveBeenCalledWith(true);
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Successful login'
      });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
      expect(localStorage.getItem('token')).toBe('user-token');
    }));

    it('should handle invalid user credentials', fakeAsync(() => {
      const errorResponse = {
        error: { message: InvalidCredentials }
      };
      authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

      component.login();
      tick();

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'Invalid Credentials'
      });
      expect(component.form.value).toEqual({ username: null, password: null });
    }));

    it('should handle inactive account', fakeAsync(() => {
      const errorResponse = {
        error: { message: InactiveAccount }
      };
      authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

      component.login();
      tick();

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'Inactive User'
      });
      expect(component.form.value).toEqual({ username: null, password: null });
    }));

    it('should handle unexpected errors', fakeAsync(() => {
      const errorResponse = {
        error: { message: 'Unknown error' }
      };
      authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

      component.login();
      tick();

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'danger',
        detail: 'Something went wrong'
      });
    }));
  });
});