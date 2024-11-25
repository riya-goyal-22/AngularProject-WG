import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { QuestionComponent } from './question.component';
import { QuestionService } from '../../services/question.service';
import { AdminService } from '../../services/admin.service';
import { PostService } from '../../services/post.service';
import { Question } from '../../modals/modals';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { DeleteQuestionByAdmin } from '../../constants/urls';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;
  let mockQuestionService: MockQuestionService;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockAdminService: jasmine.SpyObj<AdminService>;
  let mockPostService: jasmine.SpyObj<PostService>;

  const mockQuestion:Question = {
    question_id: '1',
    text: 'Test Question',
    user_id: '1',
    created_at: 'new Date()',
    replies: []
  };

  class MockQuestionService {
    activeQuestion = signal<Question>(mockQuestion);
    questions = signal<Question[]>([mockQuestion]);
    isAddAnswer = false;
    viewAnswers = false;
    deleteQuestion = jasmine.createSpy('deleteQuestion')
  }

  beforeEach(async () => {
    mockQuestionService = new MockQuestionService();
    const isAdminSignal = signal<boolean>(false);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockAdminService = jasmine.createSpyObj('AdminService', ['deleteQuestion']);
    mockPostService = jasmine.createSpyObj('PostService', {
      isDisplayingAdmin : isAdminSignal
    });

    await TestBed.configureTestingModule({
      declarations: [QuestionComponent],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      providers: [
        { provide: QuestionService, useValue: mockQuestionService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: AdminService, useValue: mockAdminService },
        { provide: PostService, useValue: mockPostService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    
    // Set up the required input
    (component as any).question = () => mockQuestion;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set active question on initialization', () => {
      component.ngOnInit();
      expect(mockQuestionService.activeQuestion()).toEqual(mockQuestion);
    });
  });

  describe('showAnswerForm', () => {
    it('should set active question and enable answer form', () => {
      component.showAnswerForm();
      
      expect(mockQuestionService.activeQuestion()).toEqual(mockQuestion);
      expect(mockQuestionService.isAddAnswer).toBeTrue();
    });
  });

  describe('showAnswers', () => {
    it('should set active question and enable answers view', () => {
      component.showAnswers();
      
      expect(mockQuestionService.activeQuestion()).toEqual(mockQuestion);
      expect(mockQuestionService.viewAnswers).toBeTrue();
    });
  });

  describe('delete', () => {
    it('should successfully delete question and update list', fakeAsync(() => {
      mockQuestionService.deleteQuestion.and.returnValue(of({data: null, code: 200, message: 'success'}));
      
      component.delete();
      tick();

      expect(mockQuestionService.activeQuestion()).toEqual(mockQuestion);
      expect(mockQuestionService.deleteQuestion).toHaveBeenCalled();
      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        detail: 'Successful deletion'
      });
      expect(mockQuestionService.questions()).toEqual([]);
    }));

    it('should handle deletion error', fakeAsync(() => {
      mockQuestionService.deleteQuestion.and.returnValue(throwError(() => new Error()));
      
      component.delete();
      tick();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'Some issue at our end'
      });
    }));

    it('should filter out deleted question from questions list', fakeAsync(() => {
      mockQuestionService.deleteQuestion.and.returnValue(of({data: null, code: 200, message: 'success'}));
      
      component.delete();
      tick();
      fixture.detectChanges();
      const result = mockQuestionService.questions()
      expect(result!.length).toBe(0);
    }));
  });

  describe('deleteByAdmin', () => {
    it('should successfully delete question through admin service', fakeAsync(() => {
      mockAdminService.deleteQuestion.and.returnValue(of({data: null, code: 200, message: 'success'}));
      
      component.deleteByAdmin();
      tick();

      expect(mockQuestionService.activeQuestion()).toEqual(mockQuestion);
      expect(mockAdminService.deleteQuestion).toHaveBeenCalled();
      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        detail: 'Successful deletion'
      });
      expect(mockQuestionService.questions()).toEqual([]);
    }));

    it('should handle admin deletion error', fakeAsync(() => {
      mockAdminService.deleteQuestion.and.returnValue(throwError(() => new Error()));
      
      component.deleteByAdmin();
      tick();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'Some issue at our end'
      });
    }));

    it('should filter out admin-deleted question from questions list', fakeAsync(() => {
      mockAdminService.deleteQuestion.and.returnValue(of({data: null, code: 200, message: 'success'}));
      
      component.deleteByAdmin();
      tick();

      const result = mockQuestionService.questions()
      expect(result!.length).toBe(0);
    }));
  });
});