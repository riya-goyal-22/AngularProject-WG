import { Component, computed, inject, input, OnChanges, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService, MenuItem, MenuItemCommandEvent, MessageService } from 'primeng/api';

import { Post, User } from '../../modals/modals';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  messageService = inject(MessageService);
  postService = inject(PostService);
  userService = inject(UserService);
  router = inject(Router);
  adminService = inject(AdminService);
  confirmService = inject(ConfirmationService);


  post = input.required<Post>();
  isHighlight: WritableSignal<boolean> = signal(false);
  items: MenuItem[] | undefined;
  postMaker: User = {
    username: '',
    email: '',
    city: '',
    id: '',
    tag: '',
    living_since: 0,
    active_status: false
  }
  
  ngOnChanges(){
    this.isHighlight.set(false);
    if(this.post().users?.includes(this.userService.user()?.id as string)) {
      this.isHighlight.set(true);
    } }

  ngOnInit() {
    this.userService.getUserById(this.post().user_id).subscribe({
      next: (response) => {
        this.postMaker = response.data
      }
    })

    this.items = [
      {
          label: 'Options',
          items: [
              {
                  label: 'Edit',
                  icon: 'pi pi-pencil',
                  command: (event: MenuItemCommandEvent) => {
                    this.postService.activePost.set(this.post());
                    this.router.navigate(['/profile/edit-post'])
                  }
              },
              {
                  label: 'Delete',
                  icon: 'pi pi-trash',
                  command: (event: MenuItemCommandEvent) => {
                    this.postService.activePost.set(this.post());
                    this.confirmService.confirm({
                      message: 'Are you sure that you want to proceed?',
                      header: 'Confirmation',
                      icon: 'pi pi-exclamation-triangle',
                      acceptIcon:"none",
                      rejectIcon:"none",
                      rejectButtonStyleClass:"p-button-text",
                      accept: () => {
                        this.postService.deletePost().subscribe({
                          next: () => {
                            this.messageService.add({
                              severity: 'success',
                              summary: 'Success',
                              detail: 'Successfully deleted'
                            });
                            this.postService.userPosts.update(current => current.filter((post) => {
                              return post.post_id !=this.postService.activePost()?.post_id
                            }))
                          }
                        })
                      },
                      reject: () => {
                        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected to delete', life: 3000 });
                      }
                  });
                }
              }
          ],
      }
  ];
  }

  toggleLike() {
    if (this.isHighlight()){
      this.postService.DislikePost(this.post().post_id).subscribe({
        next: () => {
          if(this.postService.isDisplayingProfile()){
            this.postService.userPosts.update((posts) => 
              posts.map((post) => 
                post.post_id === this.post().post_id ?
                { ...post, likes: Number(post.likes)-1, users: post.users!.filter((user_id) => 
                user_id!=this.userService.user()?.id)} : post //
              )
            )
          }else {
            this.postService.posts.update((posts) => 
              posts.map((post) => 
                post.post_id === this.post().post_id ?
                { ...post, likes: Number(post.likes)-1, users: post.users!.filter((user_id) => 
                user_id!=this.userService.user()?.id)} : post //
              )
            )
          }
          this.isHighlight.set(false);
        }
      });
    } else {
      this.postService.LikePost(this.post().post_id).subscribe({
        next: () => {
          if(this.postService.isDisplayingProfile()){
            this.postService.userPosts.update((posts) => 
              posts.map((post) => 
                post.post_id === this.post().post_id ?
                { ...post, likes: Number(post.likes)+1, users: post.users?.includes(this.userService.user()?.id as string) ? post.users 
                  : [...post.users!, this.userService.user()?.id as string],} : post //
              )
            )
          }else {
            this.postService.posts.update((posts) => 
              posts.map((post) => 
                post.post_id === this.post().post_id ?
                { ...post, likes: Number(post.likes)+1, users: post.users?.includes(this.userService.user()?.id as string) ? post.users 
                  : [...post.users!, this.userService.user()?.id as string],} : post //
              )
            )
          }
          this.isHighlight.set(true);
        }
      });
    }
  }

  openPost() {
    this.postService.activePost.set(this.post());
    this.postService.activePostMaker.set(this.postMaker.username);
    this.postService.isPostClicked.set(true);
  }

  deletePost() {
    this.postService.activePost.set(this.post());
      this.adminService.deletePost().subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully deleted'
          });
          this.postService.posts.update(current => current.filter((post) => {
            return post.post_id !=this.postService.activePost()?.post_id
          }))
        }
      })
  }
}
