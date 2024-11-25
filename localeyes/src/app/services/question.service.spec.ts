import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuestionService } from './question.service';
import { PostService } from './post.service';
import { CustomResponse, NewAnswer, NewQuestion, Post, Question } from '../modals/modals';
import { AddAnswer, AddQuestion, GetPostQuestions } from '../constants/urls';
import { signal } from '@angular/core';

describe('QuestionService', () => {
  let service: QuestionService;
  let httpMock: HttpTestingController;
  let postService: jasmine.SpyObj<PostService>;

  const mockQuestion: Question = {
    question_id: 'q123',
    text: 'Test Question',
    replies: ['Answer 1', 'Answer 2'],
  };

  const mockPost: Post = {
    post_id: 'post123',
    title: 'Test Post',
    content: 'Test Description',
    type: 'food',
    created_at: new Date().toISOString(),
    user_id: 'user123',
    likes: 0,
    users: [],
    questions: []
  };

  const mockResponse: CustomResponse = {
    code: 200,
    message: 'Success',
    data: [mockQuestion]
  };

  beforeEach(() => {
    const postServiceSpy = jasmine.createSpyObj('PostService', [], {
      activePost: signal<Post|undefined>(mockPost)
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        QuestionService,
        { provide: PostService, useValue: postServiceSpy }
      ]
    });

    service = TestBed.inject(QuestionService);
    httpMock = TestBed.inject(HttpTestingController);
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      expect(service.questions()).toBeNull();
      expect(service.activeQuestion()).toBeUndefined();
      expect(service.answers()).toBeUndefined();
      expect(service.isAddQuestion).toBeFalse();
      expect(service.isAddAnswer).toBeFalse();
      expect(service.viewAnswers).toBeFalse();
    });
  });

  describe('Computed Signals', () => {
    it('should update answers when activeQuestion changes', () => {
      // Initially undefined
      expect(service.answers()).toBeUndefined();

      // Set active question
      service.activeQuestion.set(mockQuestion);
      expect(service.answers()).toEqual(['Answer 1', 'Answer 2']);

      // Clear active question
      service.activeQuestion.set(undefined);
      expect(service.answers()).toBeUndefined();
    });
  });

  describe('addQuestion', () => {
    it('should send POST request to add a new question', () => {
      const newQuestion: NewQuestion = {
        question: 'New Test Question'
      };

      service.addQuestion(newQuestion).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(AddQuestion(mockPost.post_id));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newQuestion);
      req.flush(mockResponse);
    });

    it('should handle error when post_id is undefined', () => {
      postService.activePost.set(undefined)
      const newQuestion: NewQuestion = {
        question: 'New Test Question'
      };

      service.addQuestion(newQuestion).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('addAnswer', () => {
    it('should send PUT request to add a new answer', () => {
      service.activeQuestion.set(mockQuestion);
      const newAnswer: NewAnswer = {
        answer: 'New Test Answer'
      };

      service.addAnswer(newAnswer).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(AddAnswer(mockPost.post_id, mockQuestion.question_id));
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(newAnswer);
      req.flush(mockResponse);
    });

    it('should handle error when question_id is undefined', () => {
      service.activeQuestion.set(undefined);
      const newAnswer: NewAnswer = {
        answer: 'New Test Answer'
      };

      service.addAnswer(newAnswer).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('deleteQuestion', () => {
    it('should send DELETE request to remove a question', () => {
      service.activeQuestion.set(mockQuestion);

      service.deleteQuestion().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(AddAnswer(mockPost.post_id, mockQuestion.question_id));
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should handle error when no question is selected', () => {
      service.activeQuestion.set(undefined);

      service.deleteQuestion().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('getAllquestions', () => {
    it('should fetch all questions for the active post', () => {
      service.getAllquestions().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(GetPostQuestions(mockPost.post_id));
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error when no post is selected', () => {
      postService.activePost.set(undefined)

      service.getAllquestions().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP errors gracefully', () => {
      service.getAllquestions().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(GetPostQuestions(mockPost.post_id));
      req.flush('Not Found', {
        status: 404,
        statusText: 'Not Found'
      });
    });
  });
});