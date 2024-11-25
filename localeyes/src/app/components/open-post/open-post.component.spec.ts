import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { OpenPostComponent } from './open-post.component';
import { PostService } from '../../services/post.service';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../services/user.service';
import { CustomResponse, Post } from '../../modals/modals';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OpenPostComponent', () => {
  let component: OpenPostComponent;
  let fixture: ComponentFixture<OpenPostComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let questionService: jasmine.SpyObj<QuestionService>;
  let router: jasmine.SpyObj<Router>;

  const mockPostResponse:{
    data: Post,
    code: number,
    message: string
  } = {
    data: {
      post_id: 'test-post-1',
      user_id: 'user-1',
      title: 'Test Post',
      content: 'Test Content',
      type: 'food',
      created_at: '2024-01-01',
      likes: 10,
      questions: [
        { question_id: 'q1', text: 'Question 1', replies: []},
        { question_id: 'q2', text: 'Question 2', replies: []}
      ],
      users: ['user1', 'user2']
    },
    code: 200,
    message: 'success'
  };

  beforeEach(async () => {
    const mockPostService = jasmine.createSpyObj('PostService', ['getPostById'], {
      isPostClicked: signal(true)
    });

    // Create a writable signal for questions
    const questionsSignal = signal([{ question_id: 'q1', text: 'Question 1', replies: []}]);
    const mockQuestionService = jasmine.createSpyObj('QuestionService', [], {
      questions: questionsSignal
    });

    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [OpenPostComponent],
      imports: [HttpClientTestingModule],
      schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
      ],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: QuestionService, useValue: mockQuestionService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OpenPostComponent);
    component = fixture.componentInstance;
    questionService = TestBed.inject(QuestionService) as jasmine.SpyObj<QuestionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default post values', () => {
    expect(component.post).toEqual({
      post_id: '',
      user_id: '',
      title: '',
      content: '',
      type: 'food',
      created_at: '',
      likes: 0,
      users: null,
      questions: []
    });
  });

  it('should fetch and set post data on init', fakeAsync(() => {
    postService.getPostById.and.returnValue(of(mockPostResponse));

    component.ngOnInit();
    tick();

    expect(component.post).toEqual({
      post_id: mockPostResponse.data.post_id,
      user_id: mockPostResponse.data.user_id,
      title: mockPostResponse.data.title,
      content: mockPostResponse.data.content,
      type: mockPostResponse.data.type,
      created_at: mockPostResponse.data.created_at,
      likes: mockPostResponse.data.likes,
      questions: mockPostResponse.data.questions,
      users: mockPostResponse.data.users
    });

    expect(postService.getPostById).toHaveBeenCalled();
  }));

  it('should close overlay when closeOverlay is called', () => {
    component.closeOverlay();

    expect(postService.isPostClicked()).toBe(false);
  });

  it('should set questions and navigate to questions page when openQuestions is called', () => {
    const mockQuestions = [
      { question_id: 'q1', text: 'Question 1', replies: []},
      { question_id: 'q2', text: 'Question 2', replies: []}
    ];
    component.post.questions = mockQuestions;

    component.openQuestions();

    expect(questionService.questions()).toEqual(mockQuestions);
    expect(router.navigate).toHaveBeenCalledWith(['/questions']);
  });

  it('should handle empty questions array when opening questions', () => {
    component.post.questions = [];
    
    component.openQuestions();

    expect(questionService.questions()).toEqual([]);
    expect(router.navigate).toHaveBeenCalledWith(['/questions']);
  });
});