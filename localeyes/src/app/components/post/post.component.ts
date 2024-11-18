import { Component, computed, DoCheck, inject, input, OnChanges, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem, MessageService } from 'primeng/api';

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
  service = inject(PostService);
  userService = inject(UserService);
  router = inject(Router);
  adminService = inject(AdminService);

  post = input.required<Post>();
  isHighlight: WritableSignal<boolean> = signal(false);
  items: MenuItem[] | undefined;
  postMaker: User = {
    username: '',
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
                  command: () => {
                    this.service.activePost.set(this.post());
                    this.router.navigate(['/post/edit'])
                  }
              },
              {
                  label: 'Delete',
                  icon: 'pi pi-trash',
                  command: () => {
                    this.service.activePost.set(this.post());
                    this.service.deletePost().subscribe({
                      next: () => {
                        this.messageService.add({
                          severity: 'success',
                          summary: 'Success',
                          detail: 'Successfully deleted'
                        });
                        this.service.userPosts.update(current => current.filter((post) => {
                          return post.post_id !=this.service.activePost()?.post_id
                        }))
                      }
                    })
                  }
              }
          ],
      }
  ];
  }

  like() {
    if (this.isHighlight()){
      this.service.DislikePost(this.post().post_id).subscribe({
        next: () => {
          if(this.service.isDisplayingProfile()){
            this.service.userPosts.update((posts) => 
              posts.map((post) => 
                post.post_id === this.post().post_id ?
                { ...post, likes: Number(post.likes)-1, users: post.users!.filter((user_id) => 
                user_id!=this.userService.user()?.id)} : post //
              )
            )
          }else {
            this.service.posts.update((posts) => 
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
      this.service.LikePost(this.post().post_id).subscribe({
        next: () => {
          if(this.service.isDisplayingProfile()){
            this.service.userPosts.update((posts) => 
              posts.map((post) => 
                post.post_id === this.post().post_id ?
                { ...post, likes: Number(post.likes)+1, users: post.users?.includes(this.userService.user()?.id as string) ? post.users 
                  : [...post.users!, this.userService.user()?.id as string],} : post //
              )
            )
          }else {
            this.service.posts.update((posts) => 
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
    this.service.activePost.set(this.post());
    this.service.activePostMaker.set(this.postMaker.username);
    this.service.isPostClicked.set(true);
  }

  deletePost() {
    this.service.activePost.set(this.post());
      this.adminService.deletePost().subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully deleted'
          });
          this.service.posts.update(current => current.filter((post) => {
            return post.post_id !=this.service.activePost()?.post_id
          }))
        }
      })
  }
}
