import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { QuestionService } from '../../services/question.service';
import { CustomResponse, NewQuestion } from '../../modals/modals';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.css'
})
export class QuestionFormComponent {
  questionService = inject(QuestionService);
  postService = inject(PostService);

  question: NewQuestion = {
    question: ''
  };
  messageService = inject(MessageService);
  router = inject(Router);

  form: FormGroup = new FormGroup({
    question: new FormControl('',[Validators.required]),
  });

  Add() {
    if (this.form.valid) {
      this.question.question = this.form.controls['question'].value
      this.questionService.addQuestion(this.question).subscribe({
        next:() => {
          this.form.reset();
          this.messageService.add({
            severity:'success',
            summary: 'Success',
            detail: 'Successfully added question'
          })
          this.questionService.getAllquestions().subscribe({
            next: (response: CustomResponse) => {
              this.questionService.questions.set(response.data)
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                detail: 'Error updating questions please reload'
              })
            }
          })
          this.postService.isPostClicked.set(false);
        }
      })
      this.questionService.isAddQuestion = false;
    }
  }
}
