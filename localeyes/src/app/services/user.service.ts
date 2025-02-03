import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Deactivate, GetUserById, GetUserNotifications, GetUserProfile } from "../constants/urls";
import { CustomResponse, User, UserEdit, UserSignUp } from "../modals/modals";
import { Observable, throwError } from "rxjs";

@Injectable ({
  providedIn: 'root'
})

export class UserService {
  httpClient = inject(HttpClient);
  user = signal<User|undefined>(undefined);
  userNotifications = signal<Notification[]>([]);

  profile(): Observable<CustomResponse> {
    return this.httpClient.get<CustomResponse>(GetUserProfile)
  }

  notifications(): Observable<CustomResponse> {
    return this.httpClient.get<CustomResponse>(GetUserNotifications)
  }

  edit(user: UserEdit): Observable<CustomResponse> {
    if(!this.user()) {
      return throwError(() => new Error('No user selected'))
    }
    return this.httpClient.put<CustomResponse>(GetUserById(this.user()?.id as string),user)
  }

  getUserById(user_id: string): Observable<CustomResponse> {
    return this.httpClient.get<CustomResponse>(GetUserById(user_id))
  }

  deactivate(): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(Deactivate,null)
  }
}