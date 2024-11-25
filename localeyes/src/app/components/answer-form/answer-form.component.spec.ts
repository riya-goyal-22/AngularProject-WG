import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { of } from 'rxjs';

import { AnswerFormComponent } from './answer-form.component';
import { QuestionService } from '../../services/question.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';

describe('AnswerFormComponent', () => {
  let component: AnswerFormComponent;
  let fixture: ComponentFixture<AnswerFormComponent>;
  let questionService: jasmine.SpyObj<QuestionService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const questionServiceSpy = jasmine.createSpyObj('QuestionService', ['addAnswer', 'questions', 'activeQuestion']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AnswerFormComponent],
      imports: [
        ReactiveFormsModule,
        FloatLabelModule
      ],
      providers: [
        { provide: QuestionService, useValue: questionServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
    
    questionService = TestBed.inject(QuestionService) as jasmine.SpyObj<QuestionService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty answer control', () => {
    expect(component.form instanceof FormGroup).toBeTruthy();
    expect(component.form.get('answer')).toBeTruthy();
    expect(component.form.get('answer')?.value).toBe('');
  });

  it('should mark form as invalid when answer is empty', () => {
    const answerControl = component.form.get('answer');
    answerControl?.setValue('');
    expect(component.form.valid).toBeFalse();
  });

  it('should mark form as valid when answer is provided', () => {
    const answerControl = component.form.get('answer');
    answerControl?.setValue('Test answer');
    expect(component.form.valid).toBeTrue();
  });

  describe('Add method', () => {
    beforeEach(() => {
      questionService.addAnswer.and.returnValue(of({code: 200,message: 'ok',data: null}));
      questionService.questions.and.returnValue([
        { question_id: '1', replies: [], text: 'Test question' }
      ]);
      questionService.activeQuestion.and.returnValue({ question_id: '1', replies: [], text: 'Test question' });
    });

    it('should not call addAnswer when form is invalid', () => {
      component.form.controls['answer'].setValue('');
      component.Add();
      expect(questionService.addAnswer).not.toHaveBeenCalled();
    });

    it('should call addAnswer and show success message when form is valid', fakeAsync(() => {
      const testAnswer = 'Test answer';
      component.form.controls['answer'].setValue(testAnswer);
      
      component.Add();
      tick();

      expect(questionService.addAnswer).toHaveBeenCalledWith({ answer: testAnswer });
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully added answer'
      });
    }));

    it('should reset form after successful submission', fakeAsync(() => {
      component.form.controls['answer'].setValue('Test answer');
      
      component.Add();
      tick();
      fixture.detectChanges()
      expect(component.form.get('answer')?.value).toBe(null);
    }));

    it('should update answers array with new answer', fakeAsync(() => {
      const testAnswer = 'Test answer';
      component.form.controls['answer'].setValue(testAnswer);
      
      component.Add();
      tick();
      fixture.detectChanges()
      const questions = questionService.questions();
      expect(questions?.[0].replies).toContain(testAnswer);
    }));


    it('should set isAddAnswer to false after submission', fakeAsync(() => {
      component.form.controls['answer'].setValue('Test answer');
      
      component.Add();
      tick();

      expect(questionService.isAddAnswer).toBeFalse();
    }));
  });
});
