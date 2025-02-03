import { computed, inject, Injectable, Signal, signal } from "@angular/core";
import { Answer, CustomResponse, NewAnswer, NewQuestion, Question } from "../modals/modals";
import { HttpClient } from "@angular/common/http";
import { PostService } from "./post.service";
import { AddAnswer, AddQuestion, DeleteAnswer, DeleteQuestion, GetAnswers, GetPostQuestions } from "../constants/urls";
import { Observable, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class QuestionService {
  questions = signal<Question[] | null>(null);
  answers = signal<Answer[] | null >(null);
  activeQuestion = signal<Question|undefined>(undefined);
  activeAnswer = signal<Answer| undefined>(undefined);
  isAddQuestion: boolean = false;
  isAddAnswer: boolean = false;
  viewAnswers: boolean = false;
  httpClient = inject(HttpClient);
  postService = inject(PostService);

  addQuestion(question: NewQuestion): Observable<CustomResponse>{
    if(!this.postService.activePost()){
      return throwError(() => new Error('No Post Found'))
    }
    return this.httpClient.post<CustomResponse>(AddQuestion(this.postService.activePost()?.post_id as string),question)
  }

  addAnswer(answer: NewAnswer): Observable<CustomResponse> {
    if(!this.postService.activePost()){
      return throwError(() => new Error('No Post Found'))
    }
    if(!this.activeQuestion()){
      return throwError(() => new Error('No Question Found'))
    }
    return this.httpClient.post<CustomResponse>(AddAnswer(this.activeQuestion()?.question_id as string),answer)
  }

  deleteQuestion(): Observable<CustomResponse> {
    if(!this.postService.activePost()){
      return throwError(() => new Error('No Post Found'))
    }
    if(!this.activeQuestion()){
      return throwError(() => new Error('No Question Found'))
    }
    return this.httpClient.delete<CustomResponse>(DeleteQuestion(this.postService.activePost()?.post_id as string,this.activeQuestion()?.question_id as string))
  }

  deleteAnswer(): Observable<CustomResponse> {
    if(!this.activeQuestion()){
      return throwError(() => new Error('No Question Found'))
    }
    if(!this.activeAnswer()){
      return throwError(() => new Error('No Answer Found'))
    }
    return this.httpClient.delete<CustomResponse>(DeleteAnswer(this.activeQuestion()?.question_id as string, this.activeAnswer()?.r_id as string))
  }

  getAllquestions(): Observable<CustomResponse> {
    if(!this.postService.activePost()){
      return throwError(() => new Error('No Post Found'))
    }
    return this.httpClient.get<CustomResponse>(GetPostQuestions(this.postService.activePost()?.post_id as string))
  }

  getAllAnswers(): Observable<CustomResponse> {
    if (!this.activeQuestion()){
      return throwError(() => new Error('No Question Found'))
    }
    return this.httpClient.get<CustomResponse>(GetAnswers(this.activeQuestion()?.question_id as string))
  }
}