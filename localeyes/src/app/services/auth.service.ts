import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable, signal, WritableSignal } from "@angular/core";

import { Observable } from "rxjs";

import { ResetPassword, UserLogin, UserSignUp } from "../modals/modals";
import { CustomResponse } from "../modals/modals";
import { ForgetPassword, Login, SignUp } from "../constants/urls";

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

  login(user: UserLogin): Observable<HttpResponse<CustomResponse>> {
    return this.httpClient
    .post<CustomResponse>(Login,user,{
      observe: 'response'
    })
  }

  resetPassword(user: ResetPassword): Observable<CustomResponse> {
    return this.httpClient
    .post<CustomResponse>(ForgetPassword,user)
  }
}