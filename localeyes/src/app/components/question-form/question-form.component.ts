import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.css'
})
export class QuestionFormComponent {
  service = inject(AuthService);
  close = output<void>();

  form: FormGroup = new FormGroup({
    question: new FormControl('',[Validators.required]),
  });

  Add() {
    if (this.form.valid) {
      
    }
  }
}
