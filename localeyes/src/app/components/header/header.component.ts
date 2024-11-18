import { Component, computed, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { DataService } from '../../services/data.service';
import { CustomResponse } from '../../modals/modals';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';

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
  router = inject(Router);
  badgeNumber:Signal<string> = computed(() => String(this.userService.userNotifications().length));

  ngOnInit() {
    this.userService.notifications().subscribe({
      next: (response: CustomResponse) => {
        this.userService.userNotifications.set(response.data)
      }
    })
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login'])
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
