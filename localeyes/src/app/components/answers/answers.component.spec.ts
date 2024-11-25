import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { QuestionService } from '../../services/question.service';
import { AnswersComponent } from './answers.component';
import { signal } from '@angular/core';

class MockQuestionService {
  answer = signal<string[]>([]);
  viewAnswers:boolean = false;
}
describe('AnswersComponent', () => {
  let component: AnswersComponent;
  let fixture: ComponentFixture<AnswersComponent>;
  let questionService: MockQuestionService;

  beforeEach(async () => {
    // Create a spy object for QuestionService
    questionService = new MockQuestionService();
    await TestBed.configureTestingModule({
      declarations: [AnswersComponent],
      providers: [
        { provide: QuestionService, useValue: questionService }
      ]
    }).compileComponents();

    // Inject the service and component
    fixture = TestBed.createComponent(AnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeOverlay', () => {
    it('should set viewAnswers to false in QuestionService',() => {
        questionService.viewAnswers = true;
        component.closeOverlay();
      expect(questionService.viewAnswers).toBeFalse();
    });
  });

  it('should inject QuestionService', () => {
    expect(component.questionService).toBeTruthy();
  });
});
