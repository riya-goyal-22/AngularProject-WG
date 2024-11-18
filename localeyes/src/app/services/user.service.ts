import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Deactivate, GetUserById, GetUserNotifications, GetUserProfile } from "../constants/urls";
import { CustomResponse, User, UserSignUp } from "../modals/modals";
import { Observable } from "rxjs";

@Injectable ({
  providedIn: 'root'
})

export class UserService {
  httpClient = inject(HttpClient);
  user = signal<User|undefined>(undefined);
  userNotifications = signal<string[]>([]);

  profile(): Observable<CustomResponse> {
    return this.httpClient.get<CustomResponse>(GetUserProfile)
  }

  notifications(): Observable<CustomResponse> {
    return this.httpClient.get<CustomResponse>(GetUserNotifications)
  }

  edit(user: UserSignUp): Observable<CustomResponse> {
    return this.httpClient.put<CustomResponse>(GetUserById(this.user()?.id as string),user)
  }

  getUserById(user_id: string): Observable<CustomResponse> {
    return this.httpClient.get<CustomResponse>(GetUserById(user_id))
  }

  deactivate(): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(Deactivate,null)
  }
}