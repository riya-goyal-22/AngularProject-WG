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
export class OpenPostComponent {
  service = inject(PostService);
  router = inject(Router);
  questionService = inject(QuestionService);
  userService = inject(UserService); 

  post: Post = {
    post_id: '',
    user_id: '',
    title: '',
    content: '',
    type: 'FOOD',
    created_at: '',
    likes: 0,
  }

  ngOnInit() {
    console.log("Init:::"+this.service.activePost())
    if(this.service.activePost()){
      this.post = {
        post_id:this.service.activePost()!.post_id,
        user_id: this.service.activePost()!.user_id,
        title: this.service.activePost()!.title,
        content: this.service.activePost()!.content,
        type: this.service.activePost()!.type,
        created_at: this.service.activePost()!.created_at,
        likes: this.service.activePost()!.likes
      }
    }
  }

  closeOverlay() {
    this.service.isPostClicked.set(false);
  }

  openQuestions() {
    this.questionService.getAllquestions().subscribe({
      next: (result) => {
        this.questionService.questions.set(result.data)
      } 
    })
    this.router.navigate(['/questions']);
  }
}
