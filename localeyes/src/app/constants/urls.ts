const BaseUrl = "https://zchq7v8973.execute-api.ap-south-1.amazonaws.com/Prod"
export const SignUp = `${BaseUrl}/signup`
export const Login = `${BaseUrl}/login`
export const ForgetPassword = "http://localhost:8000/reset-password"
export const SNSError = `${BaseUrl}/sns`
export const GetAllPosts = `${BaseUrl}/posts/all`
export const CreatePost = `${BaseUrl}/user/post`
export const GetUserPosts = `${BaseUrl}/user/posts/all`
export const GetUserProfile = `${BaseUrl}/user/profile`
export const GetUserNotifications = `${BaseUrl}/user/notifications`
export const GetAllUsers = `${BaseUrl}/admin/users/all`
export const Deactivate = `${BaseUrl}/user/deactivate`
export const DeleteUser = (user_id: string): string => {
  return `${BaseUrl}/admin/user/${user_id}`
}
export const ReactivateUser = (user_id: string): string => {
  return `${BaseUrl}/admin/user/${user_id}/reactivate`
}
export const LikePost = (post_id: string): string => {
  return `${BaseUrl}/post/${post_id}/like`
}
export const LikeStatus = (post_id: string): string => {
  return `${BaseUrl}/user/post/${post_id}`
}
export const GetUserById = (user_id: string): string => {
  return `${BaseUrl}/user/${user_id}`
}
export const GetPostById = (post_id: string): string => {
  return `${BaseUrl}/post/${post_id}`
}
export const AddQuestion = (post_id: string): string => {
  return `${BaseUrl}/post/${post_id}/question`
}
export const AddAnswer = (ques_id: string): string => {
  return `${BaseUrl}/question/${ques_id}/answer`
}
export const UserPostEditing = (post_id: string): string => {
  return `${BaseUrl}/user/post/${post_id}`
}
export const DeletePostByAdmin = (user_id: string,post_id: string): string => {
  return `${BaseUrl}/admin/user/${user_id}/post/${post_id}`
}
export const DeleteQuestionByAdmin = (post_id: string,ques_id: string,user_id: string): string => {
  return `${BaseUrl}/admin/post/${post_id}/user/${user_id}/question/${ques_id}`
}
export const DeleteAnswerByAdmin = (ques_id: string,user_id: string,r_id: string): string => {
  return `${BaseUrl}/admin/question/${ques_id}/user/${user_id}/answer/${r_id}`
}
export const GetPostQuestions = (post_id: string): string => {
  return `${BaseUrl}/post/${post_id}/questions/all`
}
export const GetAnswers = (ques_id: string): string => {
  return `${BaseUrl}/question/${ques_id}/answers/all`
}
export const DeleteQuestion = (post_id: string,ques_id: string): string => {
  return `${BaseUrl}/post/${post_id}/question/${ques_id}`
}
export const DeleteAnswer = (ques_id: string, ans_id: string): string => {
  return `${BaseUrl}/question/${ques_id}/answer/${ans_id}`
}