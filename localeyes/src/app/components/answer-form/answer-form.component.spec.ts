import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerFormComponent } from './answer-form.component';
import { QuestionService } from '../../services/question.service';
import { of } from 'rxjs';

describe('AnswerFormComponent', () => {
  let component: AnswerFormComponent;
  let fixture: ComponentFixture<AnswerFormComponent>;
  let questionServiceSpy: jasmine.SpyObj<QuestionService>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerFormComponent],
      providers: [
        { provide: QuestionService, useValue: questionServiceSpy }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnswerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Add function calling question service', () => {
    questionServiceSpy = jasmine.createSpyObj('QuestionService', ['addAnswer']);
    questionServiceSpy.addAnswer.and.returnValue(of({
      code: 200,
      message: '',
      data: null
    }))

    component.form.setControl('answer','this is answer');
    component.Add();
    fixture.detectChanges();
    expect(questionServiceSpy.addAnswer).toHaveBeenCalled();
  })
});
