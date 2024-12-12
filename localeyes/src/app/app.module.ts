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
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from "primeng/api";
import { TooltipModule } from 'primeng/tooltip';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { BadgeModule } from 'primeng/badge';
import { InputOtp, InputOtpModule } from 'primeng/inputotp';

import { AppComponent } from "./app.component";
import { appConfig } from "./app.config";
import { SignupComponent } from "./components/signup/signup.component";
import { LoginComponent } from "./components/login/login.component";
import { HeaderComponent } from "./components/header/header.component";
import { PostComponent } from "./components/post/post.component";
import { PostFormComponent } from "./components/post-form/post-form.component";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { NotificationsComponent } from "./components/notifications/notifications.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { OpenPostComponent } from "./components/open-post/open-post.component";
import { QuestionFormComponent } from "./components/question-form/question-form.component";
import { AnswerFormComponent } from "./components/answer-form/answer-form.component";
import { QuestionsComponent } from "./components/questions/questions.component";
import { QuestionComponent } from "./components/question/question.component";
import { EditPostDirective } from "./directives/edit-post.directive";
import { HomeComponent } from "./components/home/home.component";
import { PostsComponent } from "./components/posts/posts.component";
import { AnswersComponent } from "./components/answers/answers.component";
import { ResetPasswordFormComponent } from "./components/reset-password-form/reset-password-form.component";
import { ManageUsersComponent } from "./components/manage-users/manage-users.component";
import { UserComponent } from "./components/user/user.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { AccessInterceptor } from "./interceptors/access.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    HeaderComponent,
    PostComponent,
    PostFormComponent,
    NotificationsComponent,
    ProfileComponent,
    OpenPostComponent,
    QuestionFormComponent,
    AnswerFormComponent,
    QuestionsComponent,
    QuestionComponent,
    HomeComponent,
    PostsComponent,
    AnswersComponent,
    ResetPasswordFormComponent,
    ManageUsersComponent,
    UserComponent,
    LoaderComponent
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
    DialogModule,
    MenuModule,
    EditPostDirective,
    ConfirmDialogModule,
    ToastModule,
    ProgressSpinnerModule,
    TooltipModule,
    InfiniteScrollModule,
    BadgeModule,
    InputOtpModule
],
  providers: [
    appConfig.providers,
    provideHttpClient(withInterceptors([AuthInterceptor, AccessInterceptor])),
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}