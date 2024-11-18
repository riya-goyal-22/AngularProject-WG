import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { UserLogin, UserSignUp } from '../../modals/modals';
import { AuthService } from '../../services/auth.service';
import { passwordStrengthValidator } from '../../validators/password.validator';
import { UserService } from '../../services/user.service';
import { InvalidCredentials } from '../../constants/errors';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  userSignUp: UserSignUp = {
    username: '',
    password: '',
    city: '',
    living_since: {
      years: 0,
      months: 0,
      days: 0,
    },
    security_answer: ''
  }
  userLogin: UserLogin = {
    username: '',
    password: ''
  }
  service = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  messageService = inject(MessageService);

  usernameNotAvailable:Boolean = false;
  isEditMode: boolean = false;

  form: FormGroup = new FormGroup({
    username: new FormControl('',[Validators.required]),
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6), passwordStrengthValidator()]),
    city: new FormControl('', [Validators.required]),
    duration: new FormGroup({
      years: new FormControl('',[Validators.required, Validators.min(0)]),
      months: new FormControl('',[Validators.required, Validators.min(0), Validators.max(11)]),
      days: new FormControl('',[Validators.required, Validators.min(0), Validators.max(30)])
    }),
    securityAnswer: new FormControl('',[Validators.required])
  });

  ngOnInit() {
    if(this.router.url.includes('profile/edit')) {
      this.isEditMode = true;
      this.form.get('city')?.setValue(this.userService.user()?.city);
      this.form.get('duration.years')?.setValue(this.userService.user()?.living_since);
      this.form.get('duration.days')?.setValue(0);
      this.form.get('duration.months')?.setValue(0);
      this.form.controls['securityAnswer'].disable();
      this.form.controls['username'].disable();
    }
  }

  submit() {
    console.log("singup entered")
    console.log(this.form)
    if (
      this.form.get('username')?.valid 
      && this.form.get('newPassword')?.valid
      && this.form.get('securityAnswer')?.valid
      && this.form.get('city')?.valid
      && this.form.get('duration')?.valid  
      && this.form.get('duration')?.valid
    ) {
      console.log("singup clicked")
      if(this.isEditMode) {
        this.userLogin.username = this.userService.user()?.username as string;
        this.userLogin.password = (this.form.controls['oldPassword'].value);
        this.userSignUp.username = this.userService.user()?.username as string;
        this.userSignUp.password = (this.form.controls['newPassword'].value);
        this.userSignUp.city = this.form.controls['city'].value;
        this.userSignUp.living_since.days = this.form.controls['duration'].get('days')?.value;
        this.userSignUp.living_since.months = this.form.controls['duration'].get('months')?.value;
        this.userSignUp.living_since.years = this.form.controls['duration'].get('years')?.value;
        this.service.login(this.userLogin).subscribe({
          next: () => {
            this.userService.edit(this.userSignUp).subscribe({
              next: () => {
                this.form.reset()
                this.messageService.add({
                  severity: 'success',
                  summary:'Success',
                  detail: 'Successfully edited profile'
                })
                this.router.navigate(['/profile'])
              },
              error: () => {
                this.messageService.add({
                  severity: 'danger',
                  detail: 'Some error occurred at our end'
                })
              }
            })
          },
          error: (err) => {
            if(err.error.message === InvalidCredentials) {
              this.messageService.add({
                severity: 'error',
                summary: 'Old credentials are wrong',
                detail: "Don't remember🤔->Try forgot password"
              })
            }
          }
        })
      }else{
      this.userSignUp.username = this.form.controls['username'].value;
      this.userSignUp.password = (this.form.controls['newPassword'].value);
      this.userSignUp.city = this.form.controls['city'].value;
      this.userSignUp.living_since.days = this.form.controls['duration'].get('days')?.value;
      this.userSignUp.living_since.months = this.form.controls['duration'].get('months')?.value;
      this.userSignUp.living_since.years = this.form.controls['duration'].get('years')?.value;
      this.userSignUp.security_answer = (this.form.controls['securityAnswer'].value);
      this.service.signup(this.userSignUp).subscribe({
        next: () => {
          console.log("user signed up");
          this.usernameNotAvailable = false;
          this.form.reset();
          this.router.navigate(['/login']);
          this.messageService.add({
            detail: 'Successful signup',
            summary: 'Success',
            severity: 'success'
          })

        },
        error: (error:HttpErrorResponse) => {
          console.log(error.error)
          if (error.error.message === "Username not available") {
            this.usernameNotAvailable = true;
          }
        }
      })
      }
    }
  }
}
