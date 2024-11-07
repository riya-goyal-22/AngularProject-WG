import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UserLogin } from '../../modals/modals';
import { AuthService } from '../../services/auth.service';
import { CustomResponse } from '../../modals/modals';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userLogin:UserLogin = {
    username: '',
    password: ''
  }
  service = inject(AuthService);
  router = inject(Router);

  form: FormGroup = new FormGroup({
    username: new FormControl('',Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  login() {
    if (this.form.valid) {
      this.userLogin.username = this.form.controls['username'].value;
      this.userLogin.password = this.form.controls['password'].value;
      this.service.login(this.userLogin).subscribe({
        next: (response: HttpResponse<CustomResponse>) => {
          console.log('user login successfully');
          this.service.token = response.body?.data;
          if (this.service.token){
            localStorage.setItem('token',this.service.token)
          }
          this.router.navigate(['/home']);
          this.form.reset();
        }
    })
    }
  }
}
