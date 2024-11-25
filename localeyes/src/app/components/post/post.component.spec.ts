import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItemCommandEvent } from 'primeng/api';
import { PostComponent } from './post.component';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';
import { of, throwError } from 'rxjs';
import { Post } from '../../modals/modals';
import { computed, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockAdminService: jasmine.SpyObj<AdminService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;

  const mockPost: Post = {
    post_id: '1',
    user_id: '11',
    title: 'string',
    type: 'food',
    content: 'string',
    likes: 0,
    created_at: 'string',
    users: null,
    questions: []
  };

  const mockUser = {
    id: '1',
    username: 'user1',
    living_since: 0,
    city: 'string',
    tag: 'string',
    active_status: true
  };

  beforeEach(async () => {
    const mockPostService = jasmine.createSpyObj('PostService', 
      ['LikePost', 'DislikePost', 'deletePost'],
      {
        activePost: signal(null),
        posts: signal([]),
        userPosts: signal([]),
        isDisplayingProfile: signal(false),
        activePostMaker: signal(''),
        isPostClicked: signal(false),
        isDisplayingAdmin: signal(false)
      }
    );

    mockUserService = jasmine.createSpyObj('UserService', ['getUserById'], {
      user: signal({ id: 'currentUser' })
    });

    mockAdminService = jasmine.createSpyObj('AdminService', ['deletePost']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    await TestBed.configureTestingModule({
      declarations: [PostComponent],
      schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
      ],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: UserService, useValue: mockUserService },
        { provide: AdminService, useValue: mockAdminService },
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ConfirmationService, useValue: mockConfirmationService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput('post', mockPost);
    component = fixture.componentInstance;
    
    // Set required input properties before ngOnInit
    component.isHighlight = signal(false);
    
    component.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-pencil',
            command: (event: MenuItemCommandEvent) => {}
          },
          {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: (event: MenuItemCommandEvent) => {}
          }
        ]
      }
    ];

    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>

    // Setup default getUserById response
    mockUserService.getUserById.and.returnValue(of({ 
      data: mockUser, 
      code: 200, 
      message: 'success'
    }));

    fixture.detectChanges(); // This will trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize postMaker on ngOnInit', fakeAsync(() => {
    tick();
    expect(component.postMaker).toEqual(mockUser);
  }));

  it('should handle like toggle when post is not liked', fakeAsync(() => {
    postService.LikePost.and.returnValue(of({
      data: [], 
      code: 200, 
      message: 'success'
    }));

    component.toggleLike();
    tick();

    expect(postService.LikePost).toHaveBeenCalledWith(mockPost.post_id);
    expect(postService.posts()).toEqual([]);
    expect(component.isHighlight()).toBeTruthy();
  }));

  it('should handle like toggle when post is already liked', fakeAsync(() => {
    component.isHighlight.set(true);
    postService.DislikePost.and.returnValue(of({
      data: [], 
      code: 200, 
      message: 'success'
    }));

    component.toggleLike();
    tick();

    expect(postService.DislikePost).toHaveBeenCalledWith(mockPost.post_id);
    expect(postService.posts()).toEqual([]);
    expect(component.isHighlight()).toBeFalsy();
  }));

  it('should set up post for editing and navigate', () => {
    const mockEvent: MenuItemCommandEvent = {
      originalEvent: new MouseEvent('click'),
      item: {
        label: 'Edit',
        icon: 'pi pi-pencil'
      }
    };

    component.items![0].items![0].command!(mockEvent);

    expect(postService.activePost()).toEqual(mockPost);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile/edit-post']);
  });

  it('should handle delete confirmation correctly', fakeAsync(() => {
    postService.deletePost.and.returnValue(of({
      data: [], 
      code: 200, 
      message: 'success'
    }));
    
    const mockEvent: MenuItemCommandEvent = {
      originalEvent: new MouseEvent('click'),
      item: {
        label: 'Delete',
        icon: 'pi pi-trash'
      }
    };

    component.items![0].items![1].command!(mockEvent);
    
    const confirmOptions = mockConfirmationService.confirm.calls.mostRecent().args[0];
    confirmOptions.accept!();
    tick();

    expect(postService.deletePost).toHaveBeenCalledWith();
    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Successfully deleted'
    });
    expect(postService.userPosts()).toEqual([]);
  }));

  it('should open post details correctly', () => {
    component.postMaker = mockUser;
    component.openPost();

    expect(postService.activePost()).toEqual(mockPost);
    expect(postService.activePostMaker()).toEqual(mockUser.username);
    expect(postService.isPostClicked()).toEqual(true);
  });

  it('should handle admin delete correctly', fakeAsync(() => {
    mockAdminService.deletePost.and.returnValue(of({
      data: [], 
      code: 200, 
      message: 'success'
    }));

    component.deletePost();
    tick();

    expect(postService.activePost()).toEqual(mockPost);
    expect(mockAdminService.deletePost).toHaveBeenCalled();
    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Successfully deleted'
    });
    expect(postService.posts()).toEqual([]);
  }));
});