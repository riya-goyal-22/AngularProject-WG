import { inject, Injectable, signal } from "@angular/core";
import { Post, CustomResponse, NewPost, EditPost } from "../modals/modals";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CreatePost, DislikePost, GetAllPosts, GetPostById, GetUserPosts, LikePost, UserPostEditing } from "../constants/urls";
import { EMPTY, Observable, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { FoodFilter, QueryParams, ShoppingFilter, TravelFilter } from "../constants/constants";
import { DataService } from "./data.service";

@Injectable({
  providedIn: 'root'
})

export class PostService {
  posts = signal<Post[]>([]);
  userPosts = signal<Post[]>([]);
  filteredPosts = signal<Post[]>([]);

  isDisplayingProfile = signal<boolean>(false);
  isDisplayingAdmin =signal<boolean>(false);
  isPostClicked = signal<boolean>(false);
  activePost = signal<Post | undefined>(undefined);
  activePostMaker = signal<string>('');

  authService = inject(AuthService);
  httpClient = inject(HttpClient);
  dataService = inject(DataService);

  offset = 0;
  itemsPerPage = 5;
  filter = "";

  getAllPosts(search: string): Observable<CustomResponse> {
    this.dataService.loadingSubject.next(true);
    return this.httpClient.get<CustomResponse>(GetAllPosts,{ params: QueryParams(this.itemsPerPage,this.offset,this.filter,search)})
  }

  getFilteredPosts(filter: string, search: string): Observable<CustomResponse> {
    return this.httpClient.get<CustomResponse>(GetAllPosts,{ params: QueryParams(this.itemsPerPage,this.offset,filter.toLowerCase(),search)})
  }

  LikePost(post_id: string): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(LikePost(post_id),null)
  }

  DislikePost(post_id: string): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(DislikePost(post_id),null)
  }

  createPost(post: NewPost): Observable<CustomResponse> {
    return this.httpClient.post<CustomResponse>(CreatePost,post)
  }

  getPostById(): Observable<CustomResponse> {
    if(!this.activePost()) {
      return throwError(() => new Error('No Post Selected'))
    }
    return this.httpClient.get<CustomResponse>(GetPostById(this.activePost()?.post_id as string))
  }

  getUserPosts(): Observable<CustomResponse> {
    return this.httpClient.get<CustomResponse>(GetUserPosts)
  }

  editPost(editedPost: EditPost): Observable<CustomResponse> {
    return this.httpClient.put<CustomResponse>(UserPostEditing(this.activePost()?.post_id as string),editedPost)
  }

  deletePost(): Observable<CustomResponse> {
    return this.httpClient.delete<CustomResponse>(UserPostEditing(this.activePost()?.post_id as string))
  }
}