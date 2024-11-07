import { Component, inject } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.css'
})
export class MyPostsComponent {
  service = inject(PostService);
}
