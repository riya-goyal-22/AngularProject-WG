import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { HomeComponent } from './home.component';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data.service';
import { CustomResponse, Post, User } from '../../modals/modals';
import { InvalidToken } from '../../constants/errors';
import { Filters } from '../../constants/constants';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let userService: jasmine.SpyObj<UserService>;
  let dataService: jasmine.SpyObj<DataService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: '1',
    username: 'Test User',
    city: 'test@test.com',
    tag: 'user',
    living_since: 1,
    active_status: true,
    email: ''
  };
  
  const mockPosts: Post[] = [
    { 
      post_id: '1',
      title: 'Post 1',
      content: '',
      created_at: '',
      likes: 0,
      type: 'food',
      questions: [],
      user_id: '11',
      users: []
    },
    { 
      post_id: '2',
      title: 'Post 2',
      content: '',
      created_at: '',
      likes: 0,
      type: 'food',
      questions: [],
      user_id: '11',
      users: []
    }
  ];

  const mockResponse: CustomResponse = {
    code: 200,
    message: 'Success',
    data: mockPosts
  };

  const mockUserResponse: CustomResponse = {
    code: 200,
    message: 'Success',
    data: mockUser
  };

  beforeEach(async () => {
    const postsSig = signal(mockPosts);
    const isPostClickedSig = signal(false);
    
    postService = jasmine.createSpyObj('PostService', 
      ['getAllPosts', 'getFilteredPosts', 'isPostClicked'],
      {
        posts: postsSig,
        // offset: 0,
        itemsPerPage: 10,
        isDisplayingAdmin: signal(false),
        isPostClicked: isPostClickedSig
      }
    );
    let internalOffset = 0;
    Object.defineProperty(postService, 'offset', {
      get: jasmine.createSpy('offset').and.callFake(() => internalOffset),
      set: jasmine.createSpy('offsetSetter').and.callFake((value: number) => {
        internalOffset = value;  // Internally store the value
      }),
      configurable: true
    });
    
    
    userService = jasmine.createSpyObj('UserService',
      ['profile'],
      {
        user: signal<User | null>(null)
      }
    );
    
    dataService = jasmine.createSpyObj('DataService',
      [],
      {
        loadingSubject: jasmine.createSpyObj('Subject', ['next'])
      }
    );
    
    router = jasmine.createSpyObj('Router',
      ['navigate'],
      {
        url: '/manage-posts'
      }
    );

    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        DropdownModule,
        InputTextModule,
        BrowserAnimationsModule,
        InfiniteScrollModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: PostService, useValue: postService },
        { provide: UserService, useValue: userService },
        { provide: DataService, useValue: dataService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    postService.getAllPosts.and.returnValue(of(mockResponse));
    postService.getFilteredPosts.and.returnValue(of(mockResponse));
    userService.profile.and.returnValue(of(mockUserResponse));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    
    // Initialize forms before detectChanges
    component.searchForm = new FormGroup({
      searchControl: new FormControl('')
    });
    
    component.form = new FormGroup({
      selectedFilter: new FormControl<string | null>(null)
    });

    // Initialize filters
    component.filters = Filters;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize user profile and load posts', () => {
      component.ngOnInit();
      
      expect(userService.profile).toHaveBeenCalled();
      expect(userService.user()).toEqual(mockUser);
      expect(postService.getAllPosts).toHaveBeenCalledWith('');
    });

    it('should redirect to login if accessing manage-posts without role', () => {
      localStorage.removeItem('role');
      
      component.ngOnInit();
      
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Search Functionality', () => {
    it('should debounce search input', fakeAsync(() => {
      component.handleSearch = jasmine.createSpy('handleSearch')
      component.searchForm.get('searchControl')?.setValue('test');
      tick(500);
      expect(component.handleSearch).not.toHaveBeenCalled();
      
      tick(400);
      expect(component.handleSearch).toHaveBeenCalledWith('test');
    }));

    it('should handle empty search term', fakeAsync(() => {
      component.searchForm.get('searchControl')?.setValue('');
      tick(900);
      
      expect(postService.getAllPosts).toHaveBeenCalledWith('');
    }));
  });

  describe('Filter Functionality', () => {
    it('should load filtered posts when filter is selected', () => {
      const mockEvent = { value: 'technology' };
      component.dropdownChange(mockEvent);
      
      expect(userService.profile).toHaveBeenCalled();
      expect(postService.getFilteredPosts).toHaveBeenCalledWith('technology', '');
    });

    it('should load all posts when filter is cleared', () => {
      const mockEvent = { value: null };
      component.dropdownChange(mockEvent);
      
      expect(userService.profile).toHaveBeenCalled();
      expect(postService.getAllPosts).toHaveBeenCalledWith('');
    });

    it('should reset offset and hasMorePosts when filter changes', () => {
      component.dropdownChange({ value: 'technology' });
      
      expect(postService.offset).toBe(0);
      expect(component.hasMorePosts).toBeTrue();
    });
  });

  describe('Infinite Scroll', () => {
    it('should append data when scrolling', () => {
      const initialOffset = postService.offset;
      component.scroll();
      fixture.detectChanges();
      
      expect(dataService.loadingSubject.next).toHaveBeenCalledWith(true);
      expect(postService.offset).toBe(initialOffset+postService.itemsPerPage);
    });

    it('should update hasMorePosts when less items are returned', () => {
      const smallResponse = { ...mockResponse, data: [mockPosts[0]] };
      postService.getAllPosts.and.returnValue(of(smallResponse));
      
      component.appendData();
      
      expect(component.hasMorePosts).toBeFalse();
    });

    it('should combine existing and new posts on append', () => {
      const newPosts = [{
        post_id: '2',
        title: 'Post 2',
        content: '',
        created_at: '',
        likes: 0,
        type: 'food',
        questions: [],
        user_id: '11',
        users: []
      }];
      const appendResponse = { ...mockResponse, data: newPosts };
      postService.getAllPosts.and.returnValue(of(appendResponse));
      
      component.appendData();
      expect(postService.posts().length).toEqual(3);
    });
  });

  describe('Error Handling', () => {
    it('should redirect to login on invalid token', () => {
      postService.getAllPosts.and.returnValue(
        throwError(() => ({ error: { message: InvalidToken } }))
      );
      
      component.loadPosts('');
      
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle errors in filtered posts', () => {
      postService.getFilteredPosts.and.returnValue(
        throwError(() => ({ error: { message: InvalidToken } }))
      );
      
      component.loadFilterPosts('technology', '');
      
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should set loading to false on error', () => {
      postService.getAllPosts.and.returnValue(
        throwError(() => ({ error: { message: 'Any error' } }))
      );
      
      component.loadPosts('');
      
      expect(dataService.loadingSubject.next).toHaveBeenCalledWith(false);
    });
  });

  describe('Form Handling', () => {
    it('should initialize forms correctly', () => {
      expect(component.searchForm.get('searchControl')).toBeTruthy();
      expect(component.form.get('selectedFilter')).toBeTruthy();
    });
  });

  describe('Cleanup', () => {
    it('should reset admin display flag on destroy when in manage-posts', () => {
      // spyOnProperty(router, 'url').and.returnValue('/manage-posts');
      
      component.ngOnDestroy();
      
      expect(postService.isDisplayingAdmin()).toBeFalse();
    });
  });
});
