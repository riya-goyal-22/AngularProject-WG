import { inject, Injectable, signal } from "@angular/core";
import { NewAnswer, NewQuestion, Question } from "../modals/modals";
import { HttpClient } from "@angular/common/http";
import { PostService } from "./post.service";
import { AddAnswer, AddQuestion } from "../constants/urls";

@Injectable({
  providedIn: 'root'
})

export class QuestionService {
  questions = signal<Question[] | null>(null);
  activeQuestionId = signal<string>('');
  isAddQuestion: boolean = false;
  isAddAnswer: boolean = false;
  httpClient = inject(HttpClient);
  postService = inject(PostService);

  addQuestion(question: NewQuestion) {
    return this.httpClient.post(AddQuestion(this.postService.activePostId()),question)
  }

  addAnswer(answer: NewAnswer) {
    return this.httpClient.put(AddAnswer(this.postService.activePostId(),this.activeQuestionId()),answer)
  }

  deleteQuestion() {

  }
}