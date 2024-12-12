import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable, signal, WritableSignal } from "@angular/core";

import { Observable } from "rxjs";

import { Otp, ResetPassword, UserLogin, UserSignUp } from "../modals/modals";
import { CustomResponse } from "../modals/modals";
import { ForgetPassword, Login, OTP, SignUp } from "../constants/urls";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  httpClient = inject(HttpClient);
  token?:string;
  isAdminLogin: WritableSignal<boolean> = signal<boolean>(false);
  isUserLogin: WritableSignal<boolean> = signal<boolean>(false);

  signup(user: UserSignUp): Observable<CustomResponse> {
    return this.httpClient
    .post<CustomResponse>(SignUp,user)
  }

  login(user: UserLogin): Observable<CustomResponse> {
    return this.httpClient
    .post<CustomResponse>(Login,user)
  }

  resetPassword(user: ResetPassword): Observable<CustomResponse> {
    return this.httpClient
    .post<CustomResponse>(ForgetPassword,user)
  }

  otp(email: Otp): Observable<CustomResponse> {
    console.log('called otp')
    console.log(email)
    console.log(OTP)
    return this.httpClient
    .post<CustomResponse>(OTP,email)
  }
}