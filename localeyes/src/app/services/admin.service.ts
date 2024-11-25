import { inject, Injectable, signal } from "@angular/core";
import { CustomResponse, User, UserLogin } from "../modals/modals";
import { HttpClient } from "@angular/common/http";
import { DeletePostByAdmin, DeleteQuestionByAdmin, DeleteUser, GetAllUsers, Login, ReactivateUser } from "../constants/urls";
import { Observable, throwError } from "rxjs";
import { PostService } from "./post.service";
import { QuestionService } from "./question.service";
import { QueryParams } from "../constants/constants";

@Injectable({
  providedIn: 'root'
})

export class AdminService {
  adminUser: User | null = null;
  httpClient = inject(HttpClient);
  postService = inject(PostService);
  questionService = inject(QuestionService);
  users = signal< User[]>([]);
  user = signal<User | undefined>(undefined);

  limit = 10;
  offset = 0;

  adminLogin(user: UserLogin): Observable<CustomResponse> {
    return this.httpClient
    .post<CustomResponse>(Login,user)
  }

  getAllUsers(search: string): Observable<CustomResponse> {
    return this.httpClient
    .get<CustomResponse>(GetAllUsers, { params: QueryParams(this.limit, this.offset, "", search) })
  }

  deleteUser(): Observable<CustomResponse> {
    if (!this.user()) {
      return throwError(() => new Error('No user selected'));
    }
    return this.httpClient
    .delete<CustomResponse>(
      DeleteUser(this.user()?.id as string)
    )
  }

  reactivateUser(): Observable<CustomResponse> {
    return this.httpClient
    .post<CustomResponse>(
      ReactivateUser
      (this.user()?.id as string),null
    )
  }

  deletePost(): Observable<CustomResponse> {
    return this.httpClient
    .delete<CustomResponse>(
      DeletePostByAdmin
      (this.postService.activePost()?.post_id as string)
    )
  }

  deleteQuestion(): Observable<CustomResponse> {
    return this.httpClient
    .delete<CustomResponse>(
      DeleteQuestionByAdmin
      (this.questionService.activeQuestion()?.question_id as string)
    )
  }
}