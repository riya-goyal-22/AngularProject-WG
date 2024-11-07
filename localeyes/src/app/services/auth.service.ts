import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { catchError, Observable, throwError } from "rxjs";

import { UserLogin, UserSignUp } from "../modals/modals";
import { CustomResponse } from "../modals/modals";
import { Login, SignUp } from "../constants/urls";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  httpClient = inject(HttpClient);
  token?:string;


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
}