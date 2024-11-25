import { Component, computed, inject } from '@angular/core';

import { QuestionService } from '../../services/question.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {
  questionService = inject(QuestionService);
  questions = computed(() => this.questionService.questions());
  postService = inject(PostService);

  showQuestionForm() {
    this.questionService.isAddQuestion = true;
  }


  closeOverlay() {
    this.questionService.isAddAnswer = false;
    this.questionService.isAddQuestion = false;
  }
}
