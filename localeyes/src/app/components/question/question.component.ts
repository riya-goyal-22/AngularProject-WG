import { Component, inject, input } from '@angular/core';

import { MessageService } from 'primeng/api';

import { QuestionService } from '../../services/question.service';
import { Question } from '../../modals/modals';
import { AdminService } from '../../services/admin.service';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrl: './question.component.css'
})
export class QuestionComponent {
  service = inject(QuestionService);
  userService = inject(UserService);
  messageService = inject(MessageService);
  question = input.required<Question>();
  postService = inject(PostService);
  adminService = inject(AdminService);
  authService = inject(AuthService);

  ngOnInit() {
    this.service.activeQuestion.set(this.question());
    console.log(this.userService.user()?.id)
    console.log(this.question().q_user_id)
  }

  showAnswerForm() {
    this.service.activeQuestion.set(this.question());
    this.service.isAddAnswer = true;
  }

  showAnswers() {
    this.service.activeQuestion.set(this.question());
    this.service.getAllAnswers().subscribe({
      next: (result) => {
        this.service.answers.set(result.data)
      }
    })
    this.service.viewAnswers = true;
  }

  delete() {
    this.service.activeQuestion.set(this.question());
    this.service.deleteQuestion().subscribe({
      next: () => {
        this.messageService.add({
          severity:'success',
          detail: 'Successful deletion'
        })
        this.service.questions.update(current => current!.filter((que) => {
          return que.question_id!=this.question().question_id
        }))
      },
      error: () => {
        this.messageService.add({
          severity:'error',
          detail: 'Some issue at our end'
        })
      }
    })
  }

  deleteByAdmin() {
    this.service.activeQuestion.set(this.question());
    this.adminService.deleteQuestion().subscribe({
      next: () => {
        this.messageService.add({
          severity:'success',
          detail: 'Successful deletion'
        })
        this.service.questions.update(current => current!.filter((que) => {
          return que.question_id!=this.question().question_id
        }))
      },
      error: () => {
        this.messageService.add({
          severity:'error',
          detail: 'Some issue at our end'
        })
      }
    })
  }
}
