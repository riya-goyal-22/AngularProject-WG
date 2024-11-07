export interface UserSignUp {
  username: string;
  password: string;
  city: string;
  living_since: {
    days: Number;
    months: Number;
    years: Number;
  }
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface CustomResponse {
  message: string;
  code: Number;
  data: any;
}

export interface Post {
  post_id: string;
  user_id: string;
  title: string;
  type: 'food'|'shopping'|'travel'|'other';
  content: string;
  likes: Number;
  created_at: string;
  questions: [{
    q_id: string,
    question_text: string,
    replies: string[]
  }] | null
}

export interface NewPost {
  title: string;
  type: string;
  content: string; 
}

export interface Question {
    q_id: string,
    question_text: string,
    replies: string[]
}

export interface NewQuestion {
  question: string
}

export interface NewAnswer {
  answer: string
}
