import { Component, inject, OnInit, output } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post, Question } from '../../modals/modals';
import { Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-open-post',
  templateUrl: './open-post.component.html',
  styleUrl: './open-post.component.css'
})
export class OpenPostComponent implements OnInit{
  service = inject(PostService);
  router = inject(Router);
  questionService = inject(QuestionService); 

  post: Post = {
    post_id: '',
    user_id: '',
    title: '',
    content: '',
    type: 'food',
    created_at: '',
    likes: 0,
    questions: null
  }

  ngOnInit() {
    this.service.getPostById().subscribe({
      next: (response) => {
        this.post = {
          post_id: response.data.post_id,
          user_id: response.data.user_id,
          title: response.data.title,
          content: response.data.content,
          type: response.data.type,
          created_at: response.data.created_at,
          likes: response.data.likes,
          questions: response.data.questions
        }
      }
    })
  }

  closeOverlay() {
    this.service.isPostClicked.set(false);
  }

  openQuestions() {
    this.questionService.questions.set(this.post.questions);
    this.router.navigate(['/questions']);
  }
}
