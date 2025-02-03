import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { UserSignUp, UserLogin, ResetPassword, CustomResponse } from '../modals/modals';
import { ForgetPassword, Login, SignUp } from '../constants/urls';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.token).toBeUndefined();
    expect(service.isAdminLogin()).toBeFalse();
    expect(service.isUserLogin()).toBeFalse();
  });

  describe('signup', () => {
    it('should send POST request to signup URL', () => {
      const mockSignUpData: UserSignUp = {
        username: 'testuser',
        password: 'Test123!',
        city: 'Test City',
        living_since: {
          years: 1,
          months: 2,
          days: 3
        },
        email: 'test answer'
      };

      const mockResponse: CustomResponse = {
        data: null,
        code: 201,
        message: 'User created successfully'
      };

      service.signup(mockSignUpData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(SignUp);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockSignUpData);
      req.flush(mockResponse);
    });

    it('should handle signup error response', () => {
      const mockSignUpData: UserSignUp = {
        username: 'testuser',
        password: 'Test123!',
        city: 'Test City',
        living_since: {
          years: 1,
          months: 2,
          days: 3
        },
        email: 'test answer'
      };

      const mockErrorResponse: CustomResponse = {
        data: null,
        code: 400,
        message: 'Username already exists'
      };

      service.signup(mockSignUpData).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toEqual(mockErrorResponse);
        }
      });

      const req = httpMock.expectOne(SignUp);
      req.flush(mockErrorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('login', () => {
    it('should send POST request to login URL', () => {
      const mockLoginData: UserLogin = {
        username: 'testuser',
        password: 'Test123!'
      };

      const mockResponse: CustomResponse = {
        data: { token: 'mock-token' },
        code: 200,
        message: 'Login successful'
      };

      service.login(mockLoginData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(Login);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginData);
      req.flush(mockResponse);
    });

    it('should handle login error response', () => {
      const mockLoginData: UserLogin = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      const mockErrorResponse: CustomResponse = {
        data: null,
        code: 401,
        message: 'Invalid credentials'
      };

      service.login(mockLoginData).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.error).toEqual(mockErrorResponse);
        }
      });

      const req = httpMock.expectOne(Login);
      req.flush(mockErrorResponse, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('resetPassword', () => {
    it('should send POST request to reset password URL', () => {
      const mockResetData: ResetPassword = {
        email: 'testuser',
        otp: 123456,
        new_password: 'NewTest123!'
      };

      const mockResponse: CustomResponse = {
        data: null,
        code: 200,
        message: 'Password reset successful'
      };

      service.resetPassword(mockResetData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(ForgetPassword);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockResetData);
      req.flush(mockResponse);
    });

    it('should handle reset password error response', () => {
      const mockResetData: ResetPassword = {
        email: 'testuser',
        otp: 123456,
        new_password: 'NewTest123!'
      };

      const mockErrorResponse: CustomResponse = {
        data: null,
        code: 400,
        message: 'Invalid security answer'
      };

      service.resetPassword(mockResetData).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toEqual(mockErrorResponse);
        }
      });

      const req = httpMock.expectOne(ForgetPassword);
      req.flush(mockErrorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('signal states', () => {
    it('should update isAdminLogin signal', () => {
      service.isAdminLogin.set(true);
      expect(service.isAdminLogin()).toBeTrue();
      
      service.isAdminLogin.set(false);
      expect(service.isAdminLogin()).toBeFalse();
    });

    it('should update isUserLogin signal', () => {
      service.isUserLogin.set(true);
      expect(service.isUserLogin()).toBeTrue();
      
      service.isUserLogin.set(false);
      expect(service.isUserLogin()).toBeFalse();
    });
  });
});