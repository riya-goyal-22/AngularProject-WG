import { Component, inject } from '@angular/core';

import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrl: './answers.component.css'
})
export class AnswersComponent {
  questionService = inject(QuestionService);

  closeOverlay() {
    this.questionService.viewAnswers = false;
  }
}
