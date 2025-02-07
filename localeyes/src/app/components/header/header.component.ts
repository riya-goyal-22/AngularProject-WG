import { Component, computed, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { DataService } from '../../services/data.service';
import { CustomResponse } from '../../modals/modals';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  authService = inject(AuthService);
  adminService = inject(AdminService);
  dataService = inject(DataService);
  postService = inject(PostService);
  userService = inject(UserService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  router = inject(Router);
  badgeNumber:Signal<string> = computed(() => {
    if(this.userService.userNotifications()){
      return String(this.userService.userNotifications().length)
    }else{
      return String(0)
    }
  })

  ngOnInit() {
    this.userService.notifications().subscribe({
      next: (response: CustomResponse) => {
        if (response.data){
          this.userService.userNotifications.set(response.data)
        }
      }
    })
  }

  logout() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"None",
      rejectIcon:"None",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected to logout', life: 3000 });
      }
    });
  }

  manageUsers() {
    this.dataService.loadingSubject.next(true);
    this.adminService.getAllUsers("").subscribe({
      next: (response) => {
        this.dataService.loadingSubject.next(false);
        this.adminService.users.set(response.data);
        this.router.navigate(['/admin/manage-users'])
      }
    })
  }

  managePosts() {
    this.dataService.loadingSubject.next(true);
    this.postService.getAllPosts("").subscribe({
      next: (response: CustomResponse) => {
        this.dataService.loadingSubject.next(false);
        this.postService.posts.set(response.data);
        this.postService.isDisplayingAdmin.set(true);
        this.postService.offset = 0;
        this.router.navigate(['/admin/manage-posts'])
      },
    })
  }
}
