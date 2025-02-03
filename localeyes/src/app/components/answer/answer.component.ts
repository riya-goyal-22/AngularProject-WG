import { Component , inject, input } from '@angular/core';
import { Answer } from '../../modals/modals';
import { UserService } from '../../services/user.service';
import { QuestionService } from '../../services/question.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.css'
})
export class AnswerComponent {
  userService = inject(UserService);
  quesService = inject(QuestionService);
  messageService = inject(MessageService);
  answer = input.required<Answer>();
  authService = inject(AuthService);
  adminService = inject(AdminService);

  deleteAnswerByAdmin() {
    this.quesService.activeAnswer.set(this.answer())
    this.adminService.deleteAnswer().subscribe({
      next: () => {
        this.messageService.add({
          severity:'success',
          summary: 'Success',
          detail: 'Successfully deleted answer'
        })
        this.quesService.answers.update(current => current!.filter((ans) => {
          return ans.r_id!=this.answer().r_id
        }))
      },
      error: (err)=> {
        this.messageService.add({
          severity:'error',
          summary: 'Error',
          detail: 'Issue at our end'
        })
      },
    })
  }

  deleteAnswer() {
    this.quesService.activeAnswer.set(this.answer())
    this.quesService.deleteAnswer().subscribe({
      next: () => {
        this.messageService.add({
          severity:'success',
          summary: 'Success',
          detail: 'Successfully deleted answer'
        })
        this.quesService.answers.update(current => current!.filter((ans) => {
          return ans.r_id!=this.answer().r_id
        }))
      },
      error: (err)=> {
        this.messageService.add({
          severity:'error',
          summary: 'Error',
          detail: 'Issue at our end'
        })
      },
    })
  }
}
