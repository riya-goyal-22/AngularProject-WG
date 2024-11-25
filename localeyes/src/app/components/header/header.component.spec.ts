import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { DataService } from '../../services/data.service';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, of } from 'rxjs';
import { signal, WritableSignal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  
  // Service spies
  let authService: jasmine.SpyObj<AuthService>;
  let adminService: jasmine.SpyObj<AdminService>;
  let dataService: MockDataService;
  let postService: jasmine.SpyObj<PostService>;
  let userService: jasmine.SpyObj<UserService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let confirmationService: jasmine.SpyObj<ConfirmationService>;
  let router: jasmine.SpyObj<Router>;

  class MockDataService {
    loadingSubject = new BehaviorSubject<boolean>(false)
  }

  beforeEach(async () => {
    const dataServiceSpy = new MockDataService()
    spyOn(dataServiceSpy.loadingSubject, 'next');
    const authServiceSpy = jasmine.createSpyObj('AuthService',['isAdminLogin']);
    const adminServiceSpy = jasmine.createSpyObj('AdminService',['getAllUsers'],{
      users: signal([])
    });
    const postServiceSpy = jasmine.createSpyObj('PostService',['getAllPosts'],{
      posts: signal([]),
      isDisplayingAdmin: signal(false),
      offset: 0
    });
    const userServiceSpy = jasmine.createSpyObj('UserService',['notifications'],{
      userNotifications: signal(['',''])
    })
    const messageServiceSpy = jasmine.createSpyObj('MessageService',['add']);
    const confirmationServiceSpy = jasmine.createSpyObj('ConfirmationService',['confirm'])
    const routerSpy = jasmine.createSpyObj('Router',['navigate'])

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports:[
        ButtonModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy},
        { provide: AdminService, useValue: adminServiceSpy},
        { 
          provide: DataService, 
          useValue: dataServiceSpy, 
        },
        { 
          provide: PostService, 
          useValue: postServiceSpy
        },
        { 
          provide: UserService, 
          useValue: userServiceSpy
        },
        { provide: MessageService,
          useValue: messageServiceSpy},
        { 
          provide: ConfirmationService, 
          useValue: confirmationServiceSpy
        },
        { provide: Router, 
          useValue: routerSpy}
      ]
    }).compileComponents();

    // Inject services
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    adminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    dataService = TestBed.inject(DataService) as MockDataService;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    confirmationService = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Create component
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch and set user notifications', () => {
      const mockNotifications = { data: ['notification1', 'notification2'], code: 200, message: 'Success'};
      userService.notifications = jasmine.createSpy().and.returnValue(of(mockNotifications));
      component.ngOnInit();

      expect(userService.userNotifications()).toBe(mockNotifications.data);
    });
  });

  describe('badgeNumber', () => {
    it('should return length of user notifications as string', () => {
      userService.userNotifications.set(['',''])
      const badgeNumber = component.badgeNumber();
      expect(badgeNumber).toBe('2');
    });
  });

  describe('logout', () => {
    it('should call confirmationService with correct parameters', () => {
      component.logout();

      expect(confirmationService.confirm).toHaveBeenCalledWith(jasmine.objectContaining({
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle'
      }));
    });

    it('should clear localStorage and navigate to login on accept', () => {
      spyOn(localStorage, 'clear').and.stub();
      confirmationService.confirm.and.callFake((config) => {
        return config.accept?.();
      });

      component.logout();

      expect(localStorage.clear).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should show error message on reject', () => {
      const confirmationCallback = {
        reject: () => {}
      };

      // Mock the confirmation service to call the reject callback
      confirmationService.confirm.and.callFake((config) => {
        return config.reject?.();
      });

      component.logout();

      expect(messageService.add).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected to logout'
        })
      );
    });
  });

  describe('manageUsers', () => {
    it('should set loading, fetch users, and navigate to manage users', fakeAsync(() => {
      const mockResponse = { data: [
        {
        id: '',
        username: '',
        living_since: 0,
        city: 'string',
        tag: 'string',
        active_status: true
        }
      ] ,code: 200, message: 'success'};

      adminService.getAllUsers.and.returnValue(of(mockResponse));

      component.manageUsers();

      // Check loading is set to true
      expect(dataService.loadingSubject.next).toHaveBeenCalledWith(true);

      // Simulate async operation
      tick();

      // Check loading is set to false
      expect(dataService.loadingSubject.next).toHaveBeenCalledWith(false);

      // Check users are set
      expect(adminService.users()).toBe(mockResponse.data);

      // Check navigation
      expect(router.navigate).toHaveBeenCalledWith(['/admin/manage-users']);
    }));
  });

  describe('managePosts', () => {
    it('should set loading, fetch posts, and navigate to manage posts', fakeAsync(() => {
      const mockResponse = { data: [] ,code: 200, message: 'success'};
      postService.getAllPosts.and.returnValue(of(mockResponse));

      component.managePosts();

      expect(dataService.loadingSubject.next).toHaveBeenCalledWith(true);
      tick();
      expect(dataService.loadingSubject.next).toHaveBeenCalledWith(false);

      // Check posts are set
      expect(postService.posts()).toEqual(mockResponse.data);

      // Check admin display is set
      expect(postService.isDisplayingAdmin()).toEqual(true);

      // Check offset is reset
      expect(postService.offset).toBe(0);

      // Check navigation
      expect(router.navigate).toHaveBeenCalledWith(['/admin/manage-posts']);
    }));
  });
});