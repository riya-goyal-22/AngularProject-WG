export interface UserSignUp {
  username: string;
  password: string;
  city: string;
  living_since: {
    days: Number;
    months: Number;
    years: Number;
  }
  email: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  living_since: number;
  city: string;
  tag: string;
  active_status: boolean;
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
  users: string[] | null;
  questions: Question[]
}

export interface NewPost {
  title: string;
  type: string;
  content: string; 
}

export interface Question {
    question_id: string,
    post_id?: string,
    user_id?: string,
    text: string,
    replies: string[],
    created_at?: string
}

export interface NewQuestion {
  question: string
}

export interface NewAnswer {
  answer: string
}

export interface EditPost {
  title: string,
  content: string
}

export interface ResetPassword {
  email: string,
  new_password: string,
  otp: number,
}

export interface Otp {
  email: string,
}