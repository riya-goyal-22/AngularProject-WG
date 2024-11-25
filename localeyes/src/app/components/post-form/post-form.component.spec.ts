import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { PostFormComponent } from './post-form.component';
import { PostService } from '../../services/post.service';
import { Filters } from '../../constants/constants';
import { signal } from '@angular/core';
import { Post } from '../../modals/modals';
import { FloatLabelModule } from 'primeng/floatlabel';

describe('PostFormComponent', () => {
  let component: PostFormComponent;
  let fixture: ComponentFixture<PostFormComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockPostService: jasmine.SpyObj<PostService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'url']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockPostService = jasmine.createSpyObj('PostService', ['createPost', 'editPost'],{
      activePost: signal<Post>({
        post_id: '1',
        user_id: '11',
        title: 'Test Title',
        content: 'Test Content',
        users: [],
        likes: 0,
        type: 'food',
        created_at: '',
        questions: []
      })
    });

    await TestBed.configureTestingModule({
      declarations: [PostFormComponent],
      imports: [
        ReactiveFormsModule,
        FloatLabelModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService },
        { provide: PostService, useValue: mockPostService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('title')?.value).toBe('');
    expect(component.form.get('content')?.value).toBe('');
    expect(component.form.get('selectedFilter')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.form;
    expect(form.valid).toBeFalsy();

    form.controls['title'].setValue('Test Title');
    form.controls['content'].setValue('Test Content');
    form.controls['selectedFilter'].setValue('news');

    expect(form.valid).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set edit mode and populate form when editing post', () => {
      Object.defineProperty(mockRouter, 'url', { value: 'profile/edit-post' });

      component.ngOnInit();

      expect(component.isEdit).toBeTrue();
      expect(component.form.get('title')?.value).toBe('Test Title');
      expect(component.form.get('content')?.value).toBe('Test Content');
      expect(component.form.get('selectedFilter')?.value).toBe('food');
      expect(component.form.get('selectedFilter')?.disabled).toBeTrue();
    });

    it('should not set edit mode when creating new post', () => {
      Object.defineProperty(mockRouter, 'url', { value: 'create-post' });
      
      component.ngOnInit();

      expect(component.isEdit).toBeFalse();
      expect(component.form.get('selectedFilter')?.disabled).toBeFalse();
    });
  });

  describe('submit', () => {
    it('should not submit if form is invalid', () => {
      component.submit();
      
      expect(mockPostService.createPost).not.toHaveBeenCalled();
      expect(mockPostService.editPost).not.toHaveBeenCalled();
    });

    it('should create new post when form is valid and not in edit mode', fakeAsync(() => {
      const newPost = {
        title: 'New Post',
        content: 'New Content',
        type: 'news'
      };

      mockPostService.createPost.and.returnValue(of({data: null, code: 200, message: 'success'}));
      
      component.form.patchValue({
        title: newPost.title,
        content: newPost.content,
        selectedFilter: 'News'
      });

      component.submit();
      tick();

      expect(mockPostService.createPost).toHaveBeenCalledWith({
        title: newPost.title,
        content: newPost.content,
        type: 'news'
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully added post'
      });
      expect(component.form.value).toEqual({
        title: null,
        content: null,
        selectedFilter: null
      });
    }));

    it('should edit existing post when in edit mode', fakeAsync(() => {
      component.isEdit = true;
      const editedPost = {
        title: 'Edited Title',
        content: 'Edited Content'
      };

      mockPostService.editPost.and.returnValue(of({data: null, code: 200, message: 'success'}));
      
      component.form.patchValue({
        title: editedPost.title,
        content: editedPost.content,
        selectedFilter: 'News'
      });

      component.submit();
      tick();

      expect(mockPostService.editPost).toHaveBeenCalledWith(editedPost);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully edited'
      });
    }));
  });
});