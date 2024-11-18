import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { ResetPassword } from '../../modals/modals';
import { AuthService } from '../../services/auth.service';
import { passwordStrengthValidator } from '../../validators/password.validator';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrl: './reset-password-form.component.css'
})
export class ResetPasswordFormComponent {
  user: ResetPassword = {
    username: '',
    new_password: '',
    security_answer: '',
  }
  service = inject(AuthService);
  router = inject(Router);
  messageService = inject(MessageService)

  form: FormGroup = new FormGroup({
    username: new FormControl('',Validators.required),
    newPassword: new FormControl('', [Validators.required, passwordStrengthValidator()]),
    securityAnswer: new FormControl('',Validators.required)
  });

  submit() {
    if (this.form.valid) {
      this.user.username = this.form.controls['username'].value;
      this.user.new_password = (this.form.controls['newPassword'].value);
      this.user.security_answer = (this.form.controls['securityAnswer'].value);
      this.service.resetPassword(this.user).subscribe({
        next: () => {
          this.form.reset();
          this.router.navigate(['/login'])
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully updated password',
          });
        }
    })
    }
  }
}
