import { inject, Injectable, signal } from "@angular/core";
import { Post, CustomResponse, NewPost } from "../modals/modals";
import { HttpClient } from "@angular/common/http";
import { CreatePost, GetAllPosts, GetPostById, LikePost } from "../constants/urls";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})

export class PostService {
  posts = signal<Post[]>([]);
  userPosts = signal<Post[]>([]);
  isPostClicked = signal<boolean>(false);
  activePostId = signal<string>('');

  authService = inject(AuthService)
  httpClient = inject(HttpClient)

  getAllPosts(): Observable<CustomResponse> {
    return this.httpClient.get<CustomResponse>(GetAllPosts)
  }

  LikePost(post_id: string): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(LikePost(post_id),null)
  }

  createPost(post: NewPost): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(CreatePost,post)
  }

  getPostById(): Observable<CustomResponse> {
    return this.httpClient.get<CustomResponse>(GetPostById(this.activePostId()))
  }
}