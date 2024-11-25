// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';
// import { MessageService } from 'primeng/api';
// import { of, throwError } from 'rxjs';
// import { Router } from '@angular/router';

// import { SignupComponent } from './signup.component';
// import { AuthService } from '../../services/auth.service';
// import { UserService } from '../../services/user.service';
// import { InvalidCredentials } from '../../constants/errors';
// import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
// import { FloatLabelModule } from 'primeng/floatlabel';
// import { InputTextModule } from 'primeng/inputtext';
// import { passwordStrengthValidator } from '../../validators/password.validator';

// describe('SignupComponent', () => {
//   let component: SignupComponent;
//   let fixture: ComponentFixture<SignupComponent>;
//   let authServiceSpy: jasmine.SpyObj<AuthService>;
//   let userServiceSpy: jasmine.SpyObj<UserService>;
//   let messageServiceSpy: jasmine.SpyObj<MessageService>;
//   let routerSpy: jasmine.SpyObj<Router>;

//   beforeEach(async () => {
//     const authSpy = jasmine.createSpyObj('AuthService', ['signup', 'login']);
//     const userSpy = jasmine.createSpyObj('UserService', ['edit', 'user']);
//     const messageSpy = jasmine.createSpyObj('MessageService', ['add']);
//     const routerSpyObj = jasmine.createSpyObj('Router', ['navigate'],{
//       url: '/profile/edit'
//     });

//     await TestBed.configureTestingModule({
//       imports: [
//         ReactiveFormsModule,
//         FormsModule
//       ],
//       schemas: [
//         CUSTOM_ELEMENTS_SCHEMA,
//         NO_ERRORS_SCHEMA
//       ],
//       declarations: [SignupComponent],
//       providers: [
//         { provide: AuthService, useValue: authSpy },
//         { provide: UserService, useValue: userSpy },
//         { provide: MessageService, useValue: messageSpy },
//         { provide: Router, useValue: routerSpyObj }
//       ]
//     }).compileComponents();

//     authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
//     userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
//     messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
//     routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SignupComponent);
//     component = fixture.componentInstance;

//     component.form.controls['username'].setValue('username');
//     component.form.controls['oldPassword'].setValue('password@124');
//     component.form.controls['newPassword'].setValue('pass@12345');
//     component.form.controls['city'].setValue('city');
//     component.form.controls['securityAnswer'].setValue('answer');
//     component.form.controls['duration.years'].setValue(2);
//     component.form.controls['duration.months'].setValue(2);
//     component.form.controls['duration.days'].setValue(2);

//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('Form Validation', () => {
//     it('should initialize with invalid form', () => {
//       expect(component.form.valid).toBeFalsy();
//     });

//     it('should validate required username', () => {
//       const username = component.form.controls['username'];
//       expect(username.valid).toBeFalsy();
//       expect(username.errors?.['required']).toBeTruthy();

//       username.setValue('testuser');
//       expect(username.valid).toBeTruthy();
//       expect(username.errors).toBeNull();
//     });

//     it('should validate password strength', () => {
//       const password = component.form.controls['newPassword'];
      
//       password.setValue('weak');
//       expect(password.errors?.['minlength']).toBeTruthy();
      
//       password.setValue('StrongPass123!');
//       expect(password.valid).toBeTruthy();
//       expect(password.errors).toBeNull();
//     });

//     it('should validate duration fields', () => {
//       const duration = component.form.get('duration');
//       const months = duration?.get('months');
      
//       months?.setValue(13);
//       expect(months?.errors?.['max']).toBeTruthy();
      
//       months?.setValue(11);
//       expect(months?.valid).toBeTruthy();
//     });
//   });

//   describe('Signup Process', () => {
//     beforeEach(() => {
//       // Fill form with valid data
//       component.form.patchValue({
//         username: 'testuser',
//         newPassword: 'StrongPass123!',
//         city: 'Test City',
//         duration: {
//           years: 2,
//           months: 6,
//           days: 15
//         },
//         securityAnswer: 'test answer'
//       });
//     });

//     it('should successfully signup new user', fakeAsync(() => {
//       authServiceSpy.signup.and.returnValue(of({data: null, code: 201, message: 'success'}));
      
//       component.submit();
//       tick();

//       expect(authServiceSpy.signup).toHaveBeenCalled();
//       expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
//       expect(messageServiceSpy.add).toHaveBeenCalledWith({
//         detail: 'Successful signup',
//         summary: 'Success',
//         severity: 'success'
//       });
//     }));

//     it('should handle username not available error', fakeAsync(() => {
//       authServiceSpy.signup.and.returnValue(throwError(() => ({
//         error: { message: 'Username not available' }
//       })));
      
//       component.submit();
//       tick();

//       expect(component.usernameNotAvailable).toBeTrue();
//     }));
//   });

//   describe('Edit Profile Mode', () => {
//     beforeEach(() => {
//       spyOnProperty(routerSpy, 'url', 'get').and.returnValue('/profile/edit');
//       userServiceSpy.user.and.returnValue({
//         username: 'existinguser',
//         city: 'Existing City',
//         living_since: 3,
//         id: '1',
//         active_status: true,
//         tag: 'test'
//       });
//     });

//     it('should initialize in edit mode with user data', () => {
//       component.ngOnInit();
      
//       expect(component.isEditMode).toBeTrue();
//       expect(component.form.get('city')?.value).toBe('Existing City');
//       expect(component.form.get('username')?.disabled).toBeTrue();
//       expect(component.form.get('securityAnswer')?.disabled).toBeTrue();
//     });

//     it('should successfully edit profile', fakeAsync(() => {
//       component.form.patchValue({
//         oldPassword: 'OldPass123!',
//         newPassword: 'NewPass123!',
//         city: 'New City',
//         duration: {
//           years: 4,
//           months: 0,
//           days: 0
//         }
//       });

//       authServiceSpy.login.and.returnValue(of({data: null, code: 201, message: 'success'}));
//       userServiceSpy.edit.and.returnValue(of({data: null, code: 201, message: 'success'}));

//       component.submit();
//       tick();

//       expect(authServiceSpy.login).toHaveBeenCalled();
//       expect(userServiceSpy.edit).toHaveBeenCalled();
//       expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile']);
//       expect(messageServiceSpy.add).toHaveBeenCalledWith({
//         severity: 'success',
//         summary: 'Success',
//         detail: 'Successfully edited profile'
//       });
//     }));

//     it('should handle invalid credentials during edit', fakeAsync(() => {
//       component.form.patchValue({
//         oldPassword: 'WrongPass123!'
//       });

//       authServiceSpy.login.and.returnValue(throwError(() => ({
//         error: { message: InvalidCredentials }
//       })));

//       component.submit();
//       tick();

//       expect(messageServiceSpy.add).toHaveBeenCalledWith({
//         severity: 'error',
//         summary: 'Old credentials are wrong',
//         detail: "Don't remember🤔->Try forgot password"
//       });
//     }));
//   });
// });