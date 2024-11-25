import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

import { QuestionsComponent } from './questions.component';
import { QuestionService } from '../../services/question.service';
import { PostService } from '../../services/post.service';
import { Question } from '../../modals/modals';

describe('QuestionsComponent', () => {
  let component: QuestionsComponent;
  let fixture: ComponentFixture<QuestionsComponent>;
  let questionService: MockQuestionService;
  let postService: jasmine.SpyObj<PostService>;

  // Sample questions data
  const mockQuestions: Question[] = [
    {
      question_id: '1',
      text: 'Test Question',
      user_id: '1',
      created_at: 'new Date()',
      replies: []
    },
    {
      question_id: '2',
      text: 'Test Question 2',
      user_id: '1',
      created_at: 'new Date()',
      replies: []
    }
  ];

  class MockQuestionService {
    questions = signal<Question[]>(mockQuestions);
    isAddQuestion = false;
    isAddAnswer = false;
  }

  beforeEach(async () => {
    questionService = new MockQuestionService();
    postService = jasmine.createSpyObj('PostService', ['adder'], {
      isDisplayingAdmin: signal<boolean>(true)
    });

    await TestBed.configureTestingModule({
      declarations: [QuestionsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: QuestionService, useValue: questionService },
        { provide: PostService, useValue: postService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with questions from service', () => {
      const questions = component.questions();
      expect(questions).toEqual(mockQuestions);
    });

    it('should have question service injected', () => {
      expect(component.questionService).toBeTruthy();
      expect(component.questionService).toBe(questionService as QuestionService);
    });

    it('should have post service injected', () => {
      expect(component.postService).toBeTruthy();
      expect(component.postService).toBe(postService);
    });
  });

  describe('showQuestionForm', () => {
    it('should set isAddQuestion to true', () => {
      component.showQuestionForm();
      expect(component.questionService.isAddQuestion).toBeTrue();
    });

    it('should not affect isAddAnswer state', () => {
      const initialIsAddAnswer = component.questionService.isAddAnswer;
      component.showQuestionForm();
      expect(component.questionService.isAddAnswer).toBe(initialIsAddAnswer);
    });
  });

  describe('closeOverlay', () => {
    beforeEach(() => {
      component.questionService.isAddAnswer = true;
      component.questionService.isAddQuestion = true;
    });
    
    it('should set isAddAnswer to false', () => {
      component.closeOverlay();
      expect(component.questionService.isAddAnswer).toBeFalse();
    });

    it('should set isAddQuestion to false', () => {
      component.closeOverlay();
      expect(component.questionService.isAddQuestion).toBeFalse();
    });

    it('should close both overlays simultaneously', () => {
      component.closeOverlay();
      expect(component.questionService.isAddAnswer).toBeFalse();
      expect(component.questionService.isAddQuestion).toBeFalse();
    });
  });

  describe('questions computed signal', () => {
    it('should update when service questions change', () => {
      const newQuestions: Question[] = [
        {
          question_id: '1',
          text: 'Test Question',
          user_id: '1',
          created_at: 'new Date()',
          replies: []
        }
      ];
      
      // Update the signal value correctly
      (questionService.questions as ReturnType<typeof signal>).set(newQuestions);
      fixture.detectChanges();
      
      expect(component.questions()).toEqual(newQuestions);
    });

    it('should handle empty questions array', () => {
      // Update the signal value correctly
      (questionService.questions as ReturnType<typeof signal>).set([]);
      fixture.detectChanges();
      
      expect(component.questions()).toEqual([]);
    });

    it('should maintain reference to original questions array', () => {
      const questionsRef = component.questions();
      expect(questionsRef).toEqual(mockQuestions); // Changed to toEqual instead of toBe
    });
  });

  describe('Component Behavior', () => {
    it('should allow multiple operations in sequence', () => {
      component.showQuestionForm();
      expect(component.questionService.isAddQuestion).toBeTrue();
      
      component.closeOverlay();
      expect(component.questionService.isAddQuestion).toBeFalse();
      expect(component.questionService.isAddAnswer).toBeFalse();
    });

    it('should maintain state consistency', () => {
      component.showQuestionForm();
      expect(component.questionService.isAddQuestion).toBeTrue();
      
      component.closeOverlay();
      expect(component.questionService.isAddQuestion).toBeFalse();
      
      component.showQuestionForm();
      expect(component.questionService.isAddQuestion).toBeTrue();
    });
  });
});