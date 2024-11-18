import { Component, computed, inject } from '@angular/core';

import { QuestionService } from '../../services/question.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {
  service = inject(QuestionService);
  questions = computed(() => this.service.questions());
  postService = inject(PostService);

  showQuestionForm() {
    this.service.isAddQuestion = true;
  }


  closeOverlay() {
    this.service.isAddAnswer = false;
    this.service.isAddQuestion = false;
  }
}
