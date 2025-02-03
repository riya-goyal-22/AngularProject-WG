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

export interface UserEdit {
  password: string;
  city: string;
  living_since: {
    days: Number;
    months: Number;
    years: Number;
  }
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

export interface DeleteUserModal {
  username: string;
  email: string;
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
  type: 'FOOD'|'SHOPPING'|'TRAVEL';
  content: string;
  likes: Number;
  created_at: string;
}

export interface PostMetadata {
  created_at: string;
  type: 'FOOD'|'SHOPPING'|'TRAVEL';
}

export interface PostLike{
  created_at: string;
  type: 'FOOD'|'SHOPPING'|'TRAVEL';
  user_id : string;
}


export interface NewPost {
  title: string;
  type: string;
  content: string; 
}

export interface Question {
    question_id: string;
    post_id?: string;
    q_user_id?: string;
    text: string;
}

export interface NewQuestion {
  text: string
}

export interface NewAnswer {
  answer: string
}

export interface Answer {
  r_id: string,
  r_user_id: string,
  q_id: string,
  answer: string,
}

export interface EditPost {
  title: string;
  content: string;
  created_at: string;
  type: 'FOOD'|'SHOPPING'|'TRAVEL';
}

export interface Notification {
  post_id: string;
  user_id: string;
  title: string;
  type: 'FOOD'|'SHOPPING'|'TRAVEL';
  content: string;
  likes: Number;
  created_at: string;
}

export interface ResetPassword {
  email: string,
  new_password: string,
  otp: number,
}

export interface Otp {
  email: string,
}