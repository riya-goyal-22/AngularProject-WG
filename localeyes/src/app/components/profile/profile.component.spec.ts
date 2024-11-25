import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { InvalidToken } from '../../constants/errors';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Post, User } from '../../modals/modals';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    mockPostService = jasmine.createSpyObj('PostService', ['getUserPosts'], {
      isDisplayingProfile: { set: jasmine.createSpy('set') },
      userPosts: signal<Post[]>([])
    });
    mockUserService = jasmine.createSpyObj('UserService', ['profile', 'deactivate'], {
      user: signal<User>({
        id: '1',
        username: 'testUser',
        living_since: 1,
        tag: 'tag',
        city: '',
        active_status: true
      })
    });

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ConfirmationService, useValue: mockConfirmationService },
        { provide: PostService, useValue: mockPostService },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isDisplayingProfile to true', () => {
      mockUserService.profile.and.returnValue(of({ data: {}, code: 200, message: 'success'}));
      mockPostService.getUserPosts.and.returnValue(of({ data: [], code: 200, message: 'success' }));

      component.ngOnInit();

      expect(mockPostService.isDisplayingProfile.set).toHaveBeenCalledWith(true);
    });

    it('should fetch and set user profile data', fakeAsync(() => {
      const mockUser = {
        id: '1',
        username: 'testUser',
        living_since: 1,
        tag: 'tag',
        city: '',
        active_status: true
      };
      mockUserService.profile.and.returnValue(of({ data: mockUser ,code: 200, message: 'success'}));
      mockPostService.getUserPosts.and.returnValue(of({ data: [],code: 200, message: 'success'}));

      component.ngOnInit();
      tick();

      expect(mockUserService.user()).toEqual(mockUser);
    }));

    it('should fetch and set user posts', fakeAsync(() => {
      const mockPosts:Post[] = [
        { 
          post_id: '1',
          title: 'Test Post',
          content: 'Test Content',
          user_id: '11',
          users: [],
          created_at: '',
          likes: 0,
          type: 'food',
          questions: []
        }
      ];
      mockUserService.profile.and.returnValue(of({ data: {}, code: 200, message: 'success' }));
      mockPostService.getUserPosts.and.returnValue(of({ data: mockPosts, code: 200, message: 'success' }));

      component.ngOnInit();
      tick();

      expect(mockPostService.userPosts()).toEqual(mockPosts);
    }));

    it('should navigate to login on invalid token error for profile', fakeAsync(() => {
      mockUserService.profile.and.returnValue(throwError(() => ({ 
        error: { message: InvalidToken } 
      })));
      mockPostService.getUserPosts.and.returnValue(of({ data: [] , code: 200, message: 'success'}));

      component.ngOnInit();
      tick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should navigate to login on invalid token error for posts', fakeAsync(() => {
      mockUserService.profile.and.returnValue(of({ data: {}, code: 200, message: 'success' }));
      mockPostService.getUserPosts.and.returnValue(throwError(() => ({ 
        error: { message: InvalidToken } 
      })));

      component.ngOnInit();
      tick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    }));
  });

  describe('ngOnDestroy', () => {
    it('should set isDisplayingProfile to false', () => {
      component.ngOnDestroy();
      expect(mockPostService.isDisplayingProfile.set).toHaveBeenCalledWith(false);
    });
  });

  describe('deactivate', () => {
    beforeEach(() => {
      mockConfirmationService.confirm.and.callFake(({ accept, reject }) => {
        if (accept) return accept();
        if (reject) return reject();
      });
    });

    it('should show confirmation dialog and deactivate on accept', fakeAsync(() => {
      mockUserService.deactivate.and.returnValue(of({data: null, code: 200, message: 'success'}));
      
      component.deactivate();
      tick();

      expect(mockConfirmationService.confirm).toHaveBeenCalled();
      expect(mockUserService.deactivate).toHaveBeenCalled();
      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        detail: 'Deactivated user'
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should show error message on deactivation failure', fakeAsync(() => {
      mockUserService.deactivate.and.returnValue(throwError(() => new Error()));
      
      component.deactivate();
      tick();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'Some issue at our end'
      });
    }));

    it('should show rejection message when user rejects deactivation', fakeAsync(() => {
      mockConfirmationService.confirm.and.callFake(({ reject }) =>  reject!());
      
      component.deactivate();
      tick();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Rejected',
        detail: 'You have rejected to deactivate',
        life: 3000
      });
    }));

    it('should clear localStorage after successful deactivation', fakeAsync(() => {
      spyOn(localStorage, 'clear');
      mockUserService.deactivate.and.returnValue(of({data: null, code: 200, message: 'success'}));
      
      component.deactivate();
      tick();

      expect(localStorage.clear).toHaveBeenCalled();
    }));
  });
});