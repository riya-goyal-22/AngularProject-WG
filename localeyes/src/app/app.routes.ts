import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ProfileComponent } from './components/profile/profile.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { HomeComponent } from './components/home/home.component';
import { ResetPasswordFormComponent } from './components/reset-password-form/reset-password-form.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { ManagePostsComponent } from './components/manage-posts/manage-posts.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'post/add',
    component: PostFormComponent
  },
  {
    path: 'notifications',
    component: NotificationsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'questions',
    component: QuestionsComponent
  },
  {
    path: 'post/edit',
    component: PostFormComponent
  },
  {
    path: 'forgot-password',
    component: ResetPasswordFormComponent
  },
  {
    path: 'profile/edit',
    component: SignupComponent
  },
  {
    path: 'admin/manage-users',
    component: ManageUsersComponent
  },
  {
    path: 'admin/manage-posts',
    component: ManagePostsComponent
  }
];
