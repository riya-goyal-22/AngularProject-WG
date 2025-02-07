import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { Otp, ResetPassword } from '../../modals/modals';
import { AuthService } from '../../services/auth.service';
import { passwordStrengthValidator } from '../../validators/password.validator';
import { NoUser, WrongOTP } from '../../constants/errors';

@Component({
  selector: 'app-reset-password-form',
  standalone: false,
  templateUrl: './reset-password-form.component.html',
  styleUrl: './reset-password-form.component.css'
})
export class ResetPasswordFormComponent {
  resetPass: ResetPassword = {
    email: '',
    new_password: '',
    otp: '',
  }
  otp: Otp = {
    email: '',
  }
  otpSent: boolean = false;
  service = inject(AuthService);
  router = inject(Router);
  messageService = inject(MessageService)

  form: FormGroup = new FormGroup({
    email: new FormControl('',Validators.required),
    newPassword: new FormControl('', [Validators.required, passwordStrengthValidator()]),
    otp: new FormControl('',Validators.required)
  });

  submit() {
    if(this.otpSent) {
      if (this.form.valid) {
        this.resetPass.email = this.form.controls['email'].value;
        this.resetPass.new_password = (this.form.controls['newPassword'].value);
        this.resetPass.otp = (this.form.controls['otp'].value);
        this.service.resetPassword(this.resetPass).subscribe({
          next: () => {
            this.form.reset();
            this.router.navigate(['/login']);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully updated password',
            });
          },
          error: (err) => {
            if(err.error.message == WrongOTP) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Wrong OTP',
              });
            }else{
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'There is some issue at our end',
              });
            }
          }
      })
      }
    }else{
      if(this.form.controls['email'].valid){
        this.otp.email = this.form.controls['email'].value;
        this.service.otp(this.otp).subscribe({
          next: () => {
            this.otpSent = true
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'OTP Sent',
            });
          },
          error: (err) => {
            if(err.error.message == NoUser) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No User Found',
              });
            }else{
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'There is some issue at our end',
              });
            }
          }
        })
      }
    }
  }
}
