import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { PostService } from './post.service';
import { QuestionService } from './question.service';
import { CustomResponse, Post, Question, User, UserLogin } from '../modals/modals';
import { DeletePostByAdmin, DeleteQuestionByAdmin, DeleteUser, GetAllUsers, Login, ReactivateUser } from '../constants/urls';
import { QueryParams } from '../constants/constants';
import { signal } from '@angular/core';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let questionServiceSpy: jasmine.SpyObj<QuestionService>;

  const mockUser: User = {
    id: '123',
    email: 'xyz@gmail.com',
    username: 'testuser',
    city: 'Test City',
    living_since: 2,
    active_status: true,
    tag: 'user'
  };

  beforeEach(() => {
    const postSpy = jasmine.createSpyObj('PostService', [], {
      activePost: signal<Post>({
        post_id: 'post123',
        title: 'Post 2',
        content: '',
        created_at: '',
        likes: 0,
        type: 'food',
        questions: [],
        user_id: '11',
        users: []
      })
    });
    const questionSpy = jasmine.createSpyObj('QuestionService', [], {
      activeQuestion: signal<Question>({
        question_id: 'question123',
        text: '',
        replies: []
      })
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AdminService,
        { provide: PostService, useValue: postSpy },
        { provide: QuestionService, useValue: questionSpy }
      ]
    });

    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    questionServiceSpy = TestBed.inject(QuestionService) as jasmine.SpyObj<QuestionService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      expect(service.adminUser).toBeNull();
      expect(service.users()).toEqual([]);
      expect(service.user()).toBeUndefined();
      expect(service.limit).toBe(10);
      expect(service.offset).toBe(0);
    });
  });

  describe('adminLogin', () => {
    it('should send POST request to login URL', () => {
      const mockLoginData: UserLogin = {
        username: 'admin',
        password: 'admin123'
      };

      const mockResponse: CustomResponse = {
        data: { token: 'admin-token' },
        code: 200,
        message: 'Admin login successful'
      };

      service.adminLogin(mockLoginData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(Login);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginData);
      req.flush(mockResponse);
    });
  });

  describe('getAllUsers', () => {
    it('should send GET request with correct query params', () => {
      const searchTerm = 'test';
      const expectedParams = QueryParams(service.limit, service.offset, '', searchTerm);
      
      const mockResponse: CustomResponse = {
        data: [mockUser],
        code: 200,
        message: 'Users retrieved successfully'
      };

      service.getAllUsers(searchTerm).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(req => req.url === GetAllUsers);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.toString()).toEqual(expectedParams.toString());
      req.flush(mockResponse);
    });
  });

  describe('deleteUser', () => {
    it('should send DELETE request with correct user ID', () => {
      service.user.set(mockUser);

      const mockResponse: CustomResponse = {
        data: null,
        code: 200,
        message: 'User deleted successfully'
      };

      service.deleteUser().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(DeleteUser(mockUser.id));
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should throw error if no user is selected', (done) => {
      service.user.set(undefined);
      
      service.deleteUser().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });
    });
  });

  describe('reactivateUser', () => {
    it('should send POST request with correct user ID', () => {
      service.user.set(mockUser);

      const mockResponse: CustomResponse = {
        data: null,
        code: 200,
        message: 'User reactivated successfully'
      };

      service.reactivateUser().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(ReactivateUser(mockUser.id));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(mockResponse);
    });
  });

  describe('deletePost', () => {
    it('should send DELETE request with correct post ID', () => {
      const mockResponse: CustomResponse = {
        data: null,
        code: 200,
        message: 'Post deleted successfully'
      };

      service.deletePost().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(DeletePostByAdmin('post123'));
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('deleteQuestion', () => {
    it('should send DELETE request with correct question ID', () => {
      const mockResponse: CustomResponse = {
        data: null,
        code: 200,
        message: 'Question deleted successfully'
      };

      service.deleteQuestion().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(DeleteQuestionByAdmin('question123'));
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('Signal Management', () => {
    it('should update users signal', () => {
      const mockUsers: User[] = [mockUser];
      service.users.set(mockUsers);
      expect(service.users()).toEqual(mockUsers);
    });

    it('should update user signal', () => {
      service.user.set(mockUser);
      expect(service.user()).toEqual(mockUser);
    });
  });
});