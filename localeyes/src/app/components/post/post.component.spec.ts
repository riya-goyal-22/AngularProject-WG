import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostComponent } from './post.component';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItemCommandEvent, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { Post, User } from '../../modals/modals';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { EditPostDirective } from '../../directives/edit-post.directive';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockAdminService: jasmine.SpyObj<AdminService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;

  const mockPost: Post = {
    post_id: '1',
    user_id: 'user1',
    likes: 5,
    users: [],
    title: 'Test title',
    content: 'Content',
    type: 'food',
    created_at: '',
    questions: []
  };

  const mockUser: User = {
    id: 'user1',
    email: '',
    username: 'testuser',
    city: 'Test City',
    tag: 'test',
    living_since: 2020,
    active_status: true
  };

  beforeEach(() => {
    // Create spy objects with method and property spies
    mockPostService = jasmine.createSpyObj('PostService', [
      'LikePost', 
      'DislikePost', 
      'deletePost', 
      'isDisplayingProfile'
    ], {
      activePost: signal({
        post_id: '2',
        user_id: 'user1',
        likes: 5,
        users: [],
        title: 'Test title',
        content: 'Content',
        type: 'food',
        created_at: '',
        questions: []
      }),
      userPosts: signal([]),
      posts: signal([]),
      isDisplayingProfile: signal(false),
      isDisplayingAdmin: signal(false),
      isPostClicked: signal(false),
      activePostMaker: signal('')
    });

    mockUserService = jasmine.createSpyObj('UserService', ['getUserById', 'user'], {
      user: signal(mockUser)
    });

    mockAdminService = jasmine.createSpyObj('AdminService', ['deletePost']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    TestBed.configureTestingModule({
      declarations: [
        PostComponent
      ],
      imports: [
        EditPostDirective
      ],
      schemas: [
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
    });

    fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput('post',mockPost)
    component = fixture.componentInstance;

    // common return values
    mockUserService.getUserById.and.returnValue(of({ 
      data: mockUser, 
      code: 200, 
      message: 'success' 
    }));
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should fetch post maker details on init', () => {
      fixture.detectChanges();
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockPost.user_id);
      expect(component.postMaker).toEqual(mockUser);
    });

    it('should set up menu items correctly', () => {
      fixture.detectChanges();
      expect(component.items).toBeDefined();
      expect(component.items![0].label).toBe('Options');
      expect(component.items![0].items!.length).toBe(2);
    });
  });

  describe('Post Highlighting', () => {
    it('should set isHighlight to false initially', () => {
      component.ngOnChanges();
      expect(component.isHighlight()).toBeFalse();
    });

    it('should set isHighlight to true if user has liked the post', () => {
      const postWithUserLike = {...mockPost, users: ['user1']};
      (component.post as any) = () => postWithUserLike;
      component.ngOnChanges();
      expect(component.isHighlight()).toBeTrue();
    });
  });

  describe('Like Functionality', () => {
    it('should dislike post when already liked', () => {
      component.isHighlight.set(true);
      mockPostService.DislikePost.and.returnValue(of({ 
        data: null, 
        code: 200, 
        message: 'Disliked successfully' 
      }));

      component.toggleLike();

      expect(mockPostService.DislikePost).toHaveBeenCalledWith(mockPost.post_id);
      expect(component.isHighlight()).toBeFalse();
    });

    it('should like post when not previously liked', () => {
      component.isHighlight.set(false);
      mockPostService.LikePost.and.returnValue(of({ 
        data: null, 
        code: 200, 
        message: 'Liked successfully' 
      }));

      component.toggleLike();

      expect(mockPostService.LikePost).toHaveBeenCalledWith(mockPost.post_id);
      expect(component.isHighlight()).toBeTrue();
    });
  });

  describe('Post Actions', () => {
    it('should set active post and mark as clicked', () => {
      component.openPost();

      expect(mockPostService.activePost()).toEqual(mockPost);
      expect(mockPostService.isPostClicked()).toEqual(true);
    });
  });

  describe('Menu Item Actions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should navigate to edit post', () => {
      const editItem = component.items![0].items![0];
      editItem.command!({} as MenuItemCommandEvent);

      expect(mockPostService.activePost()).toEqual(mockPost);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile/edit-post']);
    });

    it('should handle post deletion confirmation', () => {
      mockConfirmationService.confirm.and.callFake((config) => {
        return config.accept && config.accept();
      });

      mockPostService.deletePost.and.returnValue(of({ 
        data: null, 
        code: 200, 
        message: 'Deleted successfully' 
      }));

      const deleteItem = component.items![0].items![1];
      deleteItem.command!({} as MenuItemCommandEvent);

      expect(mockPostService.activePost()).toEqual(mockPost);
      expect(mockMessageService.add).toHaveBeenCalledWith(
        jasmine.objectContaining({ severity: 'success' })
      );
    });

    it('should handle delete confirmation rejection', () => {
      mockConfirmationService.confirm.and.callFake((config) => {
        return config.reject && config.reject();
      });

      const deleteItem = component.items![0].items![1];
      deleteItem.command!({} as MenuItemCommandEvent);

      expect(mockMessageService.add).toHaveBeenCalledWith(
        jasmine.objectContaining({ severity: 'error' })
      );
    });
  });

  describe('Admin Post Deletion', () => {
    it('should delete post via admin service', () => {
      mockAdminService.deletePost.and.returnValue(of({ 
        data: null, 
        code: 200, 
        message: 'Deleted successfully' 
      }));

      component.deletePost();

      expect(mockPostService.activePost()).toEqual(mockPost);
      expect(mockAdminService.deletePost).toHaveBeenCalled();
      expect(mockMessageService.add).toHaveBeenCalledWith(
        jasmine.objectContaining({ severity: 'success' })
      );
    });
  });
});