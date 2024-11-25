import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsComponent } from './notifications.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { CustomResponse } from '../../modals/modals';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    // Create a spy object for UserService
    userServiceSpy = jasmine.createSpyObj('UserService', ['notifications'],{
      userNotifications: signal([])
    });

    // Provide the mock service in the testing module
    TestBed.configureTestingModule({
      declarations: [NotificationsComponent],
      schemas: [
        NO_ERRORS_SCHEMA
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    });

    // Create the component and fixture
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
  });

  it('should call userService.notifications and update userNotifications on success', () => {
    // Mock the observable to return a response
    const mockResponse: CustomResponse = { data: ['notification1', 'notification2'], code: 200, message: 'success'};
    userServiceSpy.notifications.and.returnValue(of(mockResponse));

    // Trigger ngOnInit to call the method and subscribe
    component.ngOnInit();

    // Wait for the subscription to complete
    fixture.detectChanges();

    // Check if the userNotifications.set method was called with the correct data
    expect(userServiceSpy.userNotifications()).toEqual(mockResponse.data);
  });

  it('should handle empty response data correctly', () => {
    // Mock an empty response from the service
    const mockResponse: CustomResponse = { data: [], code: 200, message: 'success'};
    userServiceSpy.notifications.and.returnValue(of(mockResponse));

    // Trigger ngOnInit to call the method and subscribe
    component.ngOnInit();

    // Wait for the subscription to complete
    fixture.detectChanges();

    // Ensure that userNotifications.set was called with an empty array
    expect(userServiceSpy.userNotifications()).toEqual([]);
  });
});
