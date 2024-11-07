import { Component, inject, input } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../modals/modals';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrl: './question.component.css'
})
export class QuestionComponent {
  service = inject(QuestionService);
  question = input.required<Question>();

  showAnswerForm() {
    this.service.activeQuestionId.set(this.question().q_id);
    this.service.isAddAnswer = true;
  }
}
