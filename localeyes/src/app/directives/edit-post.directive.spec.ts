import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EditPostDirective } from './edit-post.directive';

@Component({
  template: `
    <ng-template [appEditPost]="isUserPost"><div class="content">Content Here</div></ng-template>
  `
})

class TestComponent {
  isUserPost = false;
}

describe('EditPostDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let testComponent: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [EditPostDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not render content when isUserPost is false', () => {
    testComponent.isUserPost = false;
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('.content');
    expect(content).toBeNull();
  });

  it('should render content when isUserPost is true', () => {
    testComponent.isUserPost = true;
    fixture.detectChanges();

    const content = fixture.debugElement.nativeElement.querySelector('.content')
    expect(content).toBeTruthy();
  });
});
