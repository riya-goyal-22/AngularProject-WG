import { Component, inject, input, OnInit, output } from '@angular/core';
import { Router } from '@angular/router';

import { PostService } from '../../services/post.service';
import { Post, Question } from '../../modals/modals';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-open-post',
  templateUrl: './open-post.component.html',
  styleUrl: './open-post.component.css'
})
export class OpenPostComponent implements OnInit{
  service = inject(PostService);
  router = inject(Router);
  questionService = inject(QuestionService);
  userService = inject(UserService); 

  post: Post = {
    post_id: '',
    user_id: '',
    title: '',
    content: '',
    type: 'food',
    created_at: '',
    likes: 0,
    users: null,
    questions: []
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
          questions: response.data.questions,
          users: response.data.users,
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
