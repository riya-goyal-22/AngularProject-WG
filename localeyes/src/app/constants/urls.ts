export const SignUp = "http://localhost:8000/signup"
export const Login = "http://localhost:8000/login"
export const ForgetPassword = "http://localhost:8000/reset-password"
export const OTP = "http://localhost:8000/forget-password"
export const GetAllPosts = "http://localhost:8000/api/posts/all"
export const CreatePost = "http://localhost:8000/api/post"
export const GetUserPosts = "http://localhost:8000/api/user/posts/all"
export const GetUserProfile = "http://localhost:8000/api/user/profile"
export const GetUserNotifications = "http://localhost:8000/api/user/notification"
export const GetAllUsers = "http://localhost:8000/admin/users"
export const Deactivate = "http://localhost:8000/api/user/deactivate"
export const DeleteUser = (user_id: string): string => {
  return `http://localhost:8000/admin/user/${user_id}`
}
export const ReactivateUser = (user_id: string): string => {
  return `http://localhost:8000/admin/reactivate/user/${user_id}`
}
export const LikePost = (post_id: string): string => {
  return `http://localhost:8000/api/post/${post_id}/like`
}
export const GetUserById = (user_id: string): string => {
  return `http://localhost:8000/api/user/${user_id}`
}
export const DislikePost = (post_id: string): string => {
  return `http://localhost:8000/api/post/${post_id}/dislike`
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
export const UserPostEditing = (post_id: string): string => {
  return `http://localhost:8000/api/user/post/${post_id}`
}
export const DeletePostByAdmin = (post_id: string): string => {
  return `http://localhost:8000/admin/post/${post_id}`
}
export const DeleteQuestionByAdmin = (ques_id: string): string => {
  return `http://localhost:8000/admin/question/${ques_id}`
}
export const GetPostQuestions = (post_id: string): string => {
  return `http://localhost:8000/api/post/${post_id}/questions/all`
}