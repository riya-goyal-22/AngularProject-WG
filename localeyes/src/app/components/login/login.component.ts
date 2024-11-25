import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { User, UserLogin } from '../../modals/modals';
import { AuthService } from '../../services/auth.service';
import { CustomResponse } from '../../modals/modals';
import { UserService } from '../../services/user.service';
import { InactiveAccount, InvalidCredentials } from '../../constants/errors';
import { DataService } from '../../services/data.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userLogin: UserLogin = {
    username: '',
    password: ''
  }
  service = inject(AuthService);
  userService = inject(UserService);
  adminService = inject(AdminService);
  dataService = inject(DataService);
  router = inject(Router);
  messageService = inject(MessageService)

  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  login() {
    if (this.form.valid) {
      this.userLogin.username = this.form.controls['username'].value;
      this.userLogin.password = (this.form.controls['password'].value);
      if (this.userLogin.username == 'admin') {
        this.dataService.loadingSubject.next(true);
        this.adminService.adminLogin(this.userLogin).subscribe({
          next: (response) => {
            this.dataService.loadingSubject.next(false);
            this.service.isAdminLogin.set(true);
            localStorage.setItem('token', response.data);
            localStorage.setItem('role', 'admin');
            this.form.reset();
            this.messageService.add({
              severity: 'success',
              detail: 'Successful login',
            })
            this.router.navigate(['/home']);
          },
          error: (err) => {
            this.dataService.loadingSubject.next(false);
            if (err.error.message === InvalidCredentials) {
              this.messageService.add({
                severity: 'error',
                detail: 'Invalid Credentials'
              })
              this.form.reset()
            } else {
              this.messageService.add({
                severity: 'danger',
                detail: 'Something went wrong'
              })
            }
          }
        })
      } else {
        this.dataService.loadingSubject.next(true);
        this.service.login(this.userLogin).subscribe({
          next: (response: CustomResponse) => {
            this.service.isUserLogin.set(true)
            // this.service.token = response.body?.data;
            if (response.data) {
              localStorage.setItem('token', response.data)
            }
            this.form.reset();
            this.router.navigate(['/home']);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: "Successful login"
            })
          },
          error: (err) => {
            this.dataService.loadingSubject.next(false)
            if (err.error.message === InvalidCredentials) {
              this.messageService.add({
                severity: 'error',
                detail: 'Invalid Credentials'
              })
              this.form.reset()
            } else if (err.error.message === InactiveAccount) {
              this.messageService.add({
                severity: 'error',
                detail: 'Inactive User'
              })
              this.form.reset()
            } else {
              this.messageService.add({
                severity: 'danger',
                detail: 'Something went wrong'
              })
            }
          }
        })
      }
    }
  }
}
