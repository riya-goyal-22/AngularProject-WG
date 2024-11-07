import { Component, inject, output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-answer-form',
  templateUrl: './answer-form.component.html',
  styleUrl: './answer-form.component.css'
})
export class AnswerFormComponent {
  service = inject(AuthService);
  close = output<void>();

  form: FormGroup = new FormGroup({
    answer: new FormControl('',[Validators.required]),
  });

  Add() {
    if (this.form.valid) {
      
    }
  }
}
