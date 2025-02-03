import { inject, Injectable, signal } from "@angular/core";
import { CustomResponse, DeleteUserModal, PostMetadata, User, UserLogin } from "../modals/modals";
import { HttpClient } from "@angular/common/http";
import { 
  DeleteAnswerByAdmin,
  DeletePostByAdmin,
  DeleteQuestionByAdmin,
  DeleteUser,
  GetAllUsers,
  Login,
  ReactivateUser
} from "../constants/urls";
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

  deleteUser(user: DeleteUserModal): Observable<CustomResponse> {
    if (!this.user()) {
      return throwError(() => new Error('No user selected'));
    }
    return this.httpClient
    .delete<CustomResponse>(
      DeleteUser(this.user()?.id as string),
      {
        body: user
      }
    )
  }

  reactivateUser(): Observable<CustomResponse> {
    return this.httpClient
    .post<CustomResponse>(
      ReactivateUser
      (this.user()?.id as string),null
    )
  }

  deletePost(post: PostMetadata,user_id : string): Observable<CustomResponse> {
    return this.httpClient
    .delete<CustomResponse>(
      DeletePostByAdmin
      (
        this.postService.activePost()?.user_id as string,
        this.postService.activePost()?.post_id as string
      ),
      {
        body: post
      }
    )
  }

  deleteQuestion(): Observable<CustomResponse> {
    return this.httpClient
    .delete<CustomResponse>(
      DeleteQuestionByAdmin
      (
        this.questionService.activeQuestion()?.post_id as string,
        this.questionService.activeQuestion()?.question_id as string,
        this.questionService.activeQuestion()?.q_user_id as string
      )
    )
  }

  deleteAnswer(): Observable<CustomResponse> {
    return this.httpClient
    .delete<CustomResponse>(
      DeleteAnswerByAdmin
      (
        this.questionService.activeAnswer()?.q_id as string,
        this.questionService.activeAnswer()?.r_user_id as string,
        this.questionService.activeAnswer()?.r_id as string
      )
    )
  }
}