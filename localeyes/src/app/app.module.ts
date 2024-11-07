import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { BrowserModule } from "@angular/platform-browser";
import { RouterLink, RouterModule, RouterOutlet } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, provideHttpClient, withInterceptors } from "@angular/common/http";


import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from "primeng/inputtext";
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';

import { AppComponent } from "./app.component";
import { appConfig } from "./app.config";
import { SignupComponent } from "./components/signup/signup.component";
import { LoginComponent } from "./components/login/login.component";
import { HeaderComponent } from "./components/header/header.component";
import { PostComponent } from "./components/post/post.component";
import { PostFormComponent } from "./components/post-form/post-form.component";
import { PostsComponent } from "./components/posts/posts.component";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { NotificationsComponent } from "./components/notifications/notifications.component";
import { MyPostsComponent } from "./components/my-posts/my-posts.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { OpenPostComponent } from "./components/open-post/open-post.component";
import { QuestionFormComponent } from "./components/question-form/question-form.component";
import { AnswerFormComponent } from "./components/answer-form/answer-form.component";
import { QuestionsComponent } from "./components/questions/questions.component";
import { QuestionComponent } from "./components/question/question.component";

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    HeaderComponent,
    PostComponent,
    PostFormComponent,
    PostsComponent,
    NotificationsComponent,
    MyPostsComponent,
    ProfileComponent,
    OpenPostComponent,
    QuestionFormComponent,
    AnswerFormComponent,
    QuestionsComponent,
    QuestionComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    FloatLabelModule,
    PasswordModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    RouterModule,
    RouterOutlet,
    RouterLink,
    InputTextareaModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DropdownModule,
    InputTextModule,
    ToggleButtonModule,
    SelectButtonModule,
    DialogModule
],
  providers: [
    appConfig.providers,
    provideHttpClient(withInterceptors([AuthInterceptor]))
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}