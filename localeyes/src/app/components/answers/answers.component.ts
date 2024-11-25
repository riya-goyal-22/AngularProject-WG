import { Component, computed, inject } from '@angular/core';

import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-answers',
  standalone: false,
  templateUrl: './answers.component.html',
  styleUrl: './answers.component.css'
})
export class AnswersComponent {
  questionService = inject(QuestionService);
  answers = computed(() => this.questionService.answers())

  closeOverlay() {
    this.questionService.viewAnswers = false;
  }
}
