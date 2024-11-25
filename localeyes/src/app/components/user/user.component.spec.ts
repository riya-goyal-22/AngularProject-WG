import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { AdminService } from '../../services/admin.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { User } from '../../modals/modals';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';

const mockUser:User = {
  id: '1',
  username: 'user1',
  living_since: 1,
  city: 'delhi',
  tag: 'tag',
  active_status: true
}

// Mock services with createSpyObj
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let adminService: jasmine.SpyObj<AdminService>;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    // Create spy objects for the services
    const userSignal = signal<User>(mockUser)
    const usersSignal = signal<User[]>([mockUser, {
      id: '2',
      username: 'user2',
      living_since: 1,
      city: 'delhi',
      tag: 'tag',
      active_status: true
    }])
    adminService = jasmine.createSpyObj('AdminService', [
      'deleteUser',
      'reactivateUser',
    ],{
      user: userSignal,
      users: usersSignal
    });
    messageService = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      declarations: [UserComponent],
      schemas: [
        NO_ERRORS_SCHEMA
      ],
      providers: [
        { provide: AdminService, useValue: adminService },
        { provide: MessageService, useValue: messageService }
      ]
    });

    fixture = TestBed.createComponent(UserComponent);
    fixture.componentRef.setInput('user', {
      id: '2',
      username: 'user2',
      living_since: 1,
      city: 'delhi',
      tag: 'tag',
      active_status: true
    })
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('delete()', () => {
    it('should delete the user successfully', () => {
      // Mock deleteUser to return a successful response
      const response = {
        code: 200,
        message: 'success',
        data: []
      }
      adminService.deleteUser.and.returnValue(of(response));

      component.delete();

      // Check if the deleteUser was called and the correct success message was added
      expect(adminService.user()).toEqual(component.user());
      expect(adminService.deleteUser).toHaveBeenCalled();
      expect(adminService.users().length).toEqual(1);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        detail: 'Successful deletion'
      });
    });

    it('should handle deletion error', () => {
      // Mock deleteUser to return an error
      adminService.deleteUser.and.returnValue(throwError(() => new Error('Error')));

      component.delete();
      fixture.detectChanges();
      // Check if the deleteUser was called and the error message was added
      expect(adminService.user()).toEqual(component.user());
      expect(adminService.deleteUser).toHaveBeenCalled();
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'Some issue at our end'
      });
    });
  });

  describe('reactivate()', () => {
    it('should reactivate the user successfully', () => {
      // Mock reactivateUser to return a successful response
      const response = {
        code: 200,
        message: 'success',
        data: null
      }
      adminService.reactivateUser.and.returnValue(of(response));
      
      component.reactivate();

      // Check if the reactivateUser was called and the correct success message was added
      expect(adminService.user()).toEqual(component.user());
      expect(adminService.reactivateUser).toHaveBeenCalled();
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        detail: 'User Reactivated successfully'
      });
    });

    it('should handle reactivate error if the user is already active', () => {
      // Mock reactivateUser to return an error
      adminService.reactivateUser.and.returnValue(throwError(() => new Error('User is already active')));
      //adminService.user.set = jasmine.createSpy(); // manually spy on set

      component.reactivate();

      // Check if the reactivateUser was called and the error message was added
      expect(adminService.user()).toEqual(component.user());
      expect(adminService.reactivateUser).toHaveBeenCalled();
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'User is already active'
      });
    });
  });
});
