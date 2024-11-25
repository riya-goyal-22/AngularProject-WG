import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PostService } from './post.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { Post, CustomResponse, NewPost, EditPost } from '../modals/modals';
import { CreatePost, DislikePost, GetAllPosts, GetPostById, GetUserPosts, LikePost, UserPostEditing } from '../constants/urls';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let dataService: jasmine.SpyObj<DataService>;

  const mockPost: Post = {
    post_id: '123',
    title: 'Test Post',
    content: 'Test Description',
    type: 'food',
    likes: 0,
    created_at: new Date().toISOString(),
    user_id: 'user123',
    users: [],
    questions: []
  };

  const mockResponse: CustomResponse = {
    code: 200,
    message: 'Success',
    data: [mockPost]
  };

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['someMethod']);
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['loadingSubject']);
    dataServiceSpy.loadingSubject = { next: jasmine.createSpy() };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PostService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: DataService, useValue: dataServiceSpy }
      ]
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize signals with default values', () => {
    expect(service.posts()).toEqual([]);
    expect(service.userPosts()).toEqual([]);
    expect(service.filteredPosts()).toEqual([]);
    expect(service.isDisplayingProfile()).toBeFalse();
    expect(service.isDisplayingAdmin()).toBeFalse();
    expect(service.isPostClicked()).toBeFalse();
    expect(service.activePost()).toBeUndefined();
    expect(service.activePostMaker()).toBe('');
  });

  describe('getAllPosts', () => {
    it('should fetch all posts with correct parameters', () => {
      const search = 'test';
      
      service.getAllPosts(search).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(dataService.loadingSubject.next).toHaveBeenCalledWith(true);
      });

      const req = httpMock.expectOne(request => 
        request.url === GetAllPosts &&
        request.params.get('limit') === service.itemsPerPage.toString() &&
        request.params.get('offset') === service.offset.toString() &&
        request.params.get('filter') === service.filter &&
        request.params.get('search') === search
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getFilteredPosts', () => {
    it('should fetch filtered posts with correct parameters', () => {
      const filter = 'Food';
      const search = 'test';

      service.getFilteredPosts(filter, search).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(request => 
        request.url === GetAllPosts &&
        request.params.get('limit') === service.itemsPerPage.toString() &&
        request.params.get('offset') === service.offset.toString() &&
        request.params.get('filter') === filter.toLowerCase() &&
        request.params.get('search') === search
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('LikePost', () => {
    it('should send like request for a post', () => {
      const postId = '123';

      service.LikePost(postId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(LikePost(postId));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(mockResponse);
    });
  });

  describe('DislikePost', () => {
    it('should send dislike request for a post', () => {
      const postId = '123';

      service.DislikePost(postId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(DislikePost(postId));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(mockResponse);
    });
  });

  describe('createPost', () => {
    it('should create a new post', () => {
      const newPost: NewPost = {
        title: 'New Post',
        content: 'New Description',
        type: 'food',
      };

      service.createPost(newPost).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(CreatePost);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPost);
      req.flush(mockResponse);
    });
  });

  describe('getPostById', () => {
    it('should fetch post by id when activePost is set', () => {
      service.activePost.set(mockPost);

      service.getPostById().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(GetPostById(mockPost.post_id));
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getUserPosts', () => {
    it('should fetch user posts', () => {
      service.getUserPosts().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(GetUserPosts);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('editPost', () => {
    it('should edit an existing post', () => {
      service.activePost.set(mockPost);
      const editedPost: EditPost = {
        title: 'Edited Title',
        content: 'Edited Description',
      };

      service.editPost(editedPost).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(UserPostEditing(mockPost.post_id));
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(editedPost);
      req.flush(mockResponse);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', () => {
      service.activePost.set(mockPost);

      service.deletePost().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(UserPostEditing(mockPost.post_id));
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});