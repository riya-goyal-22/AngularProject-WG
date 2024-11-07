import { Component, inject } from '@angular/core';
import { UserSignUp } from '../../modals/modals';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { passwordStrengthValidator } from '../../validators/password.validator';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


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
    }
  }
  service = inject(AuthService);
  usernameNotAvailable:Boolean = false;
  router = inject(Router);

  form: FormGroup = new FormGroup({
    username: new FormControl('',Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6), passwordStrengthValidator()]),
    city: new FormControl('', Validators.required),
    duration: new FormGroup({
      years: new FormControl('',[Validators.required, Validators.min(0)]),
      months: new FormControl('',[Validators.required, Validators.min(0), Validators.max(11)]),
      days: new FormControl('',[Validators.required, Validators.min(0), Validators.max(30)])
    })
  });


  submit() {
    if (this.form.valid) {
      console.log("form submitted");
      console.log(this.form);
      this.userSignUp.username = this.form.controls['username'].value;
      this.userSignUp.password = this.form.controls['password'].value;
      this.userSignUp.city = this.form.controls['city'].value;
      this.userSignUp.living_since.days = this.form.controls['duration'].get('days')?.value;
      this.userSignUp.living_since.months = this.form.controls['duration'].get('months')?.value;
      this.userSignUp.living_since.years = this.form.controls['duration'].get('years')?.value;
      this.service.signup(this.userSignUp).subscribe({
        next: () => {
          console.log("user signed up");
          this.usernameNotAvailable = false;
          this.form.reset();
          this.router.navigate(['/login'])
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
