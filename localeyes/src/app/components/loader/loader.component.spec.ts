import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';
import { DataService } from '../../services/data.service';
import { BehaviorSubject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let dataServiceMock: jasmine.SpyObj<DataService>;
  let loaderSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    // Create a mock of the DataService
    loaderSubject = new BehaviorSubject<boolean>(false);
    dataServiceMock = jasmine.createSpyObj('DataService', [], {
      loader$: loaderSubject.asObservable(), // Provide the mock observable
    });

    // Configure the testing module
    TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DataService, useValue: dataServiceMock }
      ]
    });

    // Create the component
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to loader$ and update isLoading', () => {
    // Initial state
    expect(component.isLoading).toBeFalse();

    // Simulate loader$ emitting a value of true
    loaderSubject.next(true);
    fixture.detectChanges();

    // Check that the isLoading property is updated
    expect(component.isLoading).toBeTrue();

    // Simulate loader$ emitting a value of false
    loaderSubject.next(false);
    fixture.detectChanges();

    // Check that the isLoading property is updated
    expect(component.isLoading).toBeFalse();
  });

  it('should unsubscribe from loader$ on ngOnDestroy', () => {
    // Spy on the unsubscribe method
    spyOn(component.subscription, 'unsubscribe');

    // Call ngOnDestroy
    component.ngOnDestroy();

    // Check that unsubscribe was called
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
