import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable, signal, WritableSignal } from "@angular/core";

import { Observable } from "rxjs";

import { Otp, ResetPassword, UserLogin, UserSignUp } from "../modals/modals";
import { CustomResponse } from "../modals/modals";
import { ForgetPassword, Login, SignUp, SendOTP } from "../constants/urls";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  httpClient = inject(HttpClient);
  token?:string;
  isAdminLogin: WritableSignal<boolean> = signal<boolean>(false);
  isUserLogin: WritableSignal<boolean> = signal<boolean>(false);
  role = localStorage.getItem('role')

  signup(user: UserSignUp): Observable<CustomResponse> {
    return this.httpClient
    .post<CustomResponse>(SignUp,user)
  }

  login(user: UserLogin): Observable<CustomResponse> {
    console.log(user)
    return this.httpClient
    .post<CustomResponse>(Login,user)
  }

  resetPassword(user: ResetPassword): Observable<CustomResponse> {
    return this.httpClient
    .post<CustomResponse>(ForgetPassword,user)
  }

  otp(email: Otp): Observable<CustomResponse> {
    return this.httpClient
    .post<CustomResponse>(SendOTP,email)
  }
}