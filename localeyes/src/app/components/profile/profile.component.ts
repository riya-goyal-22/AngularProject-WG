import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';

import { PostService } from '../../services/post.service';
import { CustomResponse, User } from '../../modals/modals';
import { UserService } from '../../services/user.service';
import { InvalidToken } from '../../constants/errors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  postService = inject(PostService);
  userService = inject(UserService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  router = inject(Router);

  ngOnInit() {
    this.postService.isDisplayingProfile.set(true);

    this.userService.profile().subscribe({
      next: (response: CustomResponse) => {
        this.userService.user.set(response.data as User)
      },
      error: (err) => {
        if(err.error.message === InvalidToken) {
          this.router.navigate(['/login'])
        }
      }
    })


    this.postService.getUserPosts().subscribe({
      next: (response: CustomResponse) => {
        this.postService.userPosts.set(response.data)
      },
      error: (err) => {
        if(err.error.message === InvalidToken) {
          this.router.navigate(['/login'])
        }
      }
    })
  }

  ngOnDestroy() {
    this.postService.isDisplayingProfile.set(false)
    this.postService.offset = 0
  }

  deactivate() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"None",
      rejectIcon:"None",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.userService.deactivate().subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              detail: 'Deactivated user'
            })
            localStorage.clear();
            this.router.navigate(['/login'])
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              detail: 'Some issue at our end'
            })
          }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected to deactivate', life: 3000 });
      }
    });
  }
}
