import { Component, inject } from '@angular/core';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {
  service = inject(QuestionService);
  

  showQuestionForm() {
    this.service.isAddQuestion = true;
  }


  closeOverlay() {
    this.service.isAddAnswer = false;
    this.service.isAddQuestion = false;
  }
}
