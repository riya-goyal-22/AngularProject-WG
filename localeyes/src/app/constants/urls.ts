export const SignUp = "http://localhost:8000/signup"
export const Login = "http://localhost:8000/login"
export const GetAllPosts = "http://localhost:8000/api/posts/all"
export const CreatePost = "http://localhost:8000/api/post"
export const LikePost = (post_id: string): string => {
  return `http://localhost:8000/api/post/${post_id}/like`
}
export const GetPostById = (post_id: string): string => {
  return `http://localhost:8000/api/post/${post_id}`
}
export const AddQuestion = (post_id: string): string => {
  return `http://localhost:8000/api/post/${post_id}/question`
}
export const AddAnswer = (post_id: string, ques_id: string): string => {
  return `http://localhost:8000/api/post/${post_id}/question/${ques_id}`
}