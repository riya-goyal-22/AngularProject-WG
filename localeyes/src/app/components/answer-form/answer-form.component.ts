import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { QuestionService } from '../../services/question.service';
import { NewAnswer } from '../../modals/modals';

@Component({
  selector: 'app-answer-form',
  standalone: false,
  templateUrl: './answer-form.component.html',
  styleUrl: './answer-form.component.css'
})

export class AnswerFormComponent {
  questionService = inject(QuestionService);
  messageService = inject(MessageService);
  router = inject(Router);
  answer: NewAnswer = {
    answer: ''
  };

  form: FormGroup = new FormGroup({
    answer: new FormControl('',[Validators.required]),
  });

  Add() {
    if (this.form.valid) {
      this.answer.answer = this.form.controls['answer'].value;
      this.questionService.addAnswer(this.answer).subscribe({
        next: () => {
          this.form.reset();
          this.messageService.add({
            severity:'success',
            summary: 'Success',
            detail: 'Successfully added answer'
          })
          this.questionService.questions()?.map((question) => {
            if (this.questionService.activeQuestion()?.question_id == question.question_id) {
              question.replies.push(this.answer.answer)
            }
            return question
          })
        }
      })
      this.questionService.isAddAnswer = false;
    }
  }
}
