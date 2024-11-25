import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { CustomResponse, User, UserSignUp } from '../modals/modals';
import { Deactivate, GetUserById, GetUserNotifications, GetUserProfile } from '../constants/urls';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 'user123',
    username: 'Test User',
    city: 'test@test.com',
    tag: 'user',
    living_since: 1,
    active_status: true
  };

  const mockUserSignUp: UserSignUp = {
    username: 'testuser',
    city: '',
    password: 'password123',
    living_since: {
      days: 1,
      months: 1,
      years: 0
    },
    security_answer: ''
  };

  const mockResponse: CustomResponse = {
    code: 200,
    message: 'Success',
    data: mockUser
  };

  const mockNotificationsResponse: CustomResponse = {
    code: 200,
    message: 'Success',
    data: ['notification1', 'notification2']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      expect(service.user()).toBeUndefined();
      expect(service.userNotifications()).toEqual([]);
    });
  });

  describe('profile', () => {
    it('should fetch user profile', () => {
      service.profile().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(GetUserProfile);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle profile fetch error', () => {
      const errorResponse = {
        status: 404,
        statusText: 'Not Found'
      };

      service.profile().subscribe({
        error: error => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(GetUserProfile);
      req.flush('Not Found', errorResponse);
    });
  });

  describe('notifications', () => {
    it('should fetch user notifications', () => {
      service.notifications().subscribe(response => {
        expect(response).toEqual(mockNotificationsResponse);
      });

      const req = httpMock.expectOne(GetUserNotifications);
      expect(req.request.method).toBe('GET');
      req.flush(mockNotificationsResponse);
    });

    it('should handle empty notifications', () => {
      const emptyResponse: CustomResponse = {
        code: 200,
        message: 'Success',
        data: []
      };

      service.notifications().subscribe(response => {
        expect(response.data).toEqual([]);
      });

      const req = httpMock.expectOne(GetUserNotifications);
      req.flush(emptyResponse);
    });
  });

  describe('edit', () => {
    it('should update user profile when user is set', () => {
      service.user.set(mockUser);
      
      service.edit(mockUserSignUp).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(GetUserById(mockUser.id));
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockUserSignUp);
      req.flush(mockResponse);
    });

    it('should handle error when no user is set', () => {
      service.user.set(undefined);

      service.edit(mockUserSignUp).subscribe({
        error: error => {
          expect(error).toBeTruthy();
        }
      });
    });

    it('should handle validation errors', () => {
      service.user.set(mockUser);
      const errorResponse = {
        status: 400,
        statusText: 'Bad Request',
        error: {
          message: 'Validation Error'
        }
      };

      service.edit(mockUserSignUp).subscribe({
        error: error => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(GetUserById(mockUser.id));
      req.flush('Validation Error', errorResponse);
    });
  });

  describe('getUserById', () => {
    it('should fetch user by id', () => {
      const userId = 'user123';

      service.getUserById(userId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(GetUserById(userId));
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle non-existent user', () => {
      const userId = 'nonexistent';
      const errorResponse = {
        status: 404,
        statusText: 'Not Found'
      };

      service.getUserById(userId).subscribe({
        error: error => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(GetUserById(userId));
      req.flush('User not found', errorResponse);
    });
  });

  describe('deactivate', () => {
    it('should send deactivation request', () => {
      const deactivateResponse: CustomResponse = {
        code: 200,
        message: 'Account deactivated successfully',
        data: null
      };

      service.deactivate().subscribe(response => {
        expect(response).toEqual(deactivateResponse);
      });

      const req = httpMock.expectOne(Deactivate);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(deactivateResponse);
    });

    it('should handle deactivation error', () => {
      const errorResponse = {
        status: 403,
        statusText: 'Forbidden'
      };

      service.deactivate().subscribe({
        error: error => {
          expect(error.status).toBe(403);
        }
      });

      const req = httpMock.expectOne(Deactivate);
      req.flush('Deactivation failed', errorResponse);
    });
  });


  describe('Error Handling', () => {
    it('should handle network errors', () => {
      service.profile().subscribe({
        error: error => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(GetUserProfile);
      req.error(new ProgressEvent('Network error'));
    });

    it('should handle server errors', () => {
      service.profile().subscribe({
        error: error => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(GetUserProfile);
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    });
  });
});