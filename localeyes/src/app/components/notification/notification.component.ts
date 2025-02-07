import { Component , inject, input } from '@angular/core';
import { Notification, User } from '../../modals/modals';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  notification = input.required<Notification>()
  postService = inject(PostService)
  userService = inject(UserService)
  postMaker: User = {
      username: '',
      email: '',
      city: '',
      id: '',
      tag: '',
      living_since: 0,
      active_status: false
    }

  ngOnInit() {
    this.userService.getUserById(this.notification().user_id).subscribe({
      next: (response) => {
        this.postMaker = response.data
      }
    })
  }

  openPost() {
    this.postService.activePost.set(this.notification());
    this.postService.activePostMaker.set(this.postMaker.username);
    this.postService.isPostClicked.set(true);
  }

  onDestroy() {
    this.postService.offset = 0
  }
}
