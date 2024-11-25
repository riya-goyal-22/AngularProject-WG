import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { QuestionFormComponent } from './question-form.component';
import { QuestionService } from '../../services/question.service';
import { PostService } from '../../services/post.service';
import { CustomResponse, NewQuestion } from '../../modals/modals';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('QuestionFormComponent', () => {
  let component: QuestionFormComponent;
  let fixture: ComponentFixture<QuestionFormComponent>;
  let mockQuestionService: jasmine.SpyObj<QuestionService>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockQuestionService = jasmine.createSpyObj('QuestionService', ['addQuestion', 'getAllquestions'], {
      questions: { set: jasmine.createSpy('set') },
      isAddQuestion: false
    });
    
    mockPostService = jasmine.createSpyObj('PostService', [], {
      isPostClicked: { set: jasmine.createSpy('set') }
    });
    
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [QuestionFormComponent],
      imports: [ReactiveFormsModule],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      providers: [
        { provide: QuestionService, useValue: mockQuestionService },
        { provide: PostService, useValue: mockPostService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should create form with question control', () => {
      expect(component.form.get('question')).toBeTruthy();
      expect(component.form.get('question')?.validator).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
      expect(component.form.get('question')?.value).toBe('');
    });

    it('should be invalid when empty', () => {
      expect(component.form.valid).toBeFalsy();
    });

    it('should be valid when question has value', () => {
      component.form.get('question')?.setValue('Test Question');
      expect(component.form.valid).toBeTruthy();
    });
  });

  describe('Add Method', () => {
    const mockQuestion: NewQuestion = {
      question: 'Test Question'
    };

    const mockResponse: CustomResponse = {
      data: [
        {
          question_id: '1',
          text: 'Test Question',
          user_id: '1',
          created_at: 'new Date()',
          replies: []
        }
      ],
      code: 200,
      message: 'success'
    };

    beforeEach(() => {
      component.form.get('question')?.setValue(mockQuestion.question);
    });

    it('should not submit if form is invalid', () => {
      component.form.get('question')?.setValue('');
      component.Add();
      expect(mockQuestionService.addQuestion).not.toHaveBeenCalled();
    });

    it('should successfully add question and reset form', fakeAsync(() => {
      mockQuestionService.addQuestion.and.returnValue(of({data: null, code: 200, message: 'success'}));
      mockQuestionService.getAllquestions.and.returnValue(of(mockResponse));

      component.Add();
      tick();

      expect(mockQuestionService.addQuestion).toHaveBeenCalledWith(mockQuestion);
      expect(component.form.get('question')?.value).toBe(null);
      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully added question'
      });
    }));

    it('should update questions list after successful addition', fakeAsync(() => {
      mockQuestionService.addQuestion.and.returnValue(of({data: null, code: 200, message: 'success'}));
      mockQuestionService.getAllquestions.and.returnValue(of(mockResponse));

      component.Add();
      tick();

      expect(mockQuestionService.getAllquestions).toHaveBeenCalled();
      expect(mockQuestionService.questions.set).toHaveBeenCalledWith(mockResponse.data);
    }));

    it('should set isPostClicked to false after successful addition', fakeAsync(() => {
      mockQuestionService.addQuestion.and.returnValue(of({data: null, code: 200, message: 'success'}));
      mockQuestionService.getAllquestions.and.returnValue(of(mockResponse));

      component.Add();
      tick();

      expect(mockPostService.isPostClicked.set).toHaveBeenCalledWith(false);
    }));

    it('should set isAddQuestion to false after form submission', fakeAsync(() => {
      mockQuestionService.addQuestion.and.returnValue(of({data: null, code: 200, message: 'success'}));
      mockQuestionService.getAllquestions.and.returnValue(of(mockResponse));

      component.Add();
      tick();

      expect(mockQuestionService.isAddQuestion).toBeFalse();
    }));

    it('should handle error in getAllquestions', fakeAsync(() => {
      mockQuestionService.addQuestion.and.returnValue(of({data: null, code: 200, message: 'success'}));
      mockQuestionService.getAllquestions.and.returnValue(throwError(() => new Error()));

      component.Add();
      tick();

      expect(mockQuestionService.questions.set).not.toHaveBeenCalled();
      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'Error updating questions please reload'
      })
    }));
  });

  describe('Form Validation', () => {
    it('should show validation error for empty question', () => {
      const questionControl = component.form.get('question');
      questionControl?.setValue('');
      expect(questionControl?.errors?.['required']).toBeTruthy();
    });

    it('should clear validation error when question is entered', () => {
      const questionControl = component.form.get('question');
      questionControl?.setValue('Test Question');
      expect(questionControl?.errors).toBeNull();
    });
  });
});