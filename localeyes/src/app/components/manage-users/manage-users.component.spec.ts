import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ManageUsersComponent } from './manage-users.component';
import { AdminService } from '../../services/admin.service';
import { DataService } from '../../services/data.service';
import { User } from '../../modals/modals';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';


describe('ManageUsersComponent', () => {
  let component: ManageUsersComponent;
  let fixture: ComponentFixture<ManageUsersComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUsers: User[] = [
    { id: '1', username: 'user1', city: 'delhi', active_status: true ,living_since: 1, tag:'tag'},
    { id: '2', username: 'user2', city: 'delhi', active_status: true ,living_since: 1, tag:'tag'},
    { id: '3', username: 'user3', city: 'delhi', active_status: true ,living_since: 1, tag:'tag'},
  ];

  beforeEach(async () => {
    const adminSpy = jasmine.createSpyObj('AdminService', ['getAllUsers'], {
      users: signal([]),
    });
    let _offset = 0;
    let _limit = 10;

    // Use Object.defineProperty to make offset and limit writable
    Object.defineProperty(adminSpy, 'offset', {
      get: () => _offset,
      set: (value: number) => { _offset = value; },
      enumerable: true,
      configurable: true
    });

    Object.defineProperty(adminSpy, 'limit', {
      get: () => _limit,
      set: (value: number) => { _limit = value; },
      enumerable: true,
      configurable: true
    });
    const dataSpy = jasmine.createSpyObj('DataService', [], {
      loadingSubject: { next: jasmine.createSpy('next') }
    });
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [
        ManageUsersComponent
      ],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AdminService, useValue: adminSpy },
        { provide: DataService, useValue: dataSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    adminServiceSpy = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(ManageUsersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    localStorage.setItem('role', 'admin');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should redirect to admin login if no role in localStorage', () => {
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/login']);
  });

  it('should filter out admin user from users list', () => {
    localStorage.setItem('role', 'admin');
    fixture.detectChanges();
    expect(component.users().length).toBe(0);
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      localStorage.setItem('role', 'admin');
      fixture.detectChanges();
    });

    it('should initialize search form', () => {
      expect(component.searchForm.get('searchControl')).toBeTruthy();
      expect(component.searchForm.get('searchControl')?.value).toBe('');
    });

    it('should debounce search and call handleSearch', fakeAsync(() => {
      const mockResponse = { data: mockUsers, message: 'success', code: 200};
      adminServiceSpy.getAllUsers.and.returnValue(of(mockResponse));
      
      component.searchForm.controls.searchControl.setValue('test');
      tick(500); // Before debounce time
      expect(adminServiceSpy.getAllUsers).not.toHaveBeenCalled();
      
      tick(400); // Complete debounce time
      expect(adminServiceSpy.getAllUsers).toHaveBeenCalledWith('test');
      expect(adminServiceSpy.offset).toBe(0);
      expect(dataServiceSpy.loadingSubject.next).toHaveBeenCalledWith(true);
    }));

    it('should not make API call if search term is the same', fakeAsync(() => {
      const mockResponse = { data: mockUsers, message: 'success', code: 200};
      adminServiceSpy.getAllUsers.and.returnValue(of(mockResponse));
      
      component.searchForm.controls.searchControl.setValue('test');
      tick(900);
      expect(adminServiceSpy.getAllUsers).toHaveBeenCalledTimes(1);
      
      component.searchForm.controls.searchControl.setValue('test');
      tick(900);
      expect(adminServiceSpy.getAllUsers).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Data Loading', () => {
    beforeEach(() => {
      localStorage.setItem('role', 'admin');
      fixture.detectChanges();
    });

    it('should load initial data', () => {
      const mockResponse = { data: mockUsers, message: 'success', code: 200};
      adminServiceSpy.getAllUsers.and.returnValue(of(mockResponse));
      
      component.loadData();
      
      expect(dataServiceSpy.loadingSubject.next).toHaveBeenCalledWith(true);
      expect(adminServiceSpy.getAllUsers).toHaveBeenCalled();
      expect(adminServiceSpy.users()).toEqual(mockUsers);
    });

    it('should append data on scroll', () => {
      const mockResponse = { data: mockUsers, message: 'success', code: 200};
      adminServiceSpy.getAllUsers.and.returnValue(of(mockResponse));
      
      component.scroll();
      
      expect(adminServiceSpy.offset).toBe(10);
      expect(dataServiceSpy.loadingSubject.next).toHaveBeenCalledWith(true);
      expect(adminServiceSpy.getAllUsers).toHaveBeenCalled();
      expect(adminServiceSpy.users()).toEqual(mockUsers);
    });

    it('should append data with current search term', () => {
      const mockResponse = { data: mockUsers, message: 'success', code: 200};
      adminServiceSpy.getAllUsers.and.returnValue(of(mockResponse));
      
      component.searchForm.controls.searchControl.setValue('test');
      component.appendData();
      
      expect(adminServiceSpy.getAllUsers).toHaveBeenCalledWith('test');
      expect(adminServiceSpy.users()).toEqual(mockUsers);
    });
  });

  describe('Scroll Functionality', () => {
    beforeEach(() => {
      localStorage.setItem('role', 'admin');
      fixture.detectChanges();
    });

    it('should increase offset and load more data on scroll', () => {
      const initialOffset = adminServiceSpy.offset;
      const mockResponse = { data: mockUsers, message: 'success', code: 200};
      adminServiceSpy.getAllUsers.and.returnValue(of(mockResponse));
      
      component.scroll();
      fixture.detectChanges();
      expect(adminServiceSpy.offset).toBe(initialOffset + adminServiceSpy.limit);
      expect(adminServiceSpy.getAllUsers).toHaveBeenCalled();
    });
  });
});