import { Component, computed, inject, input, signal } from '@angular/core';

import { PostService } from '../../services/post.service';
import { Post } from '../../modals/modals';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent {
  postService = inject(PostService);
  view = input.required<"home"|"profile">();

  posts = computed(() => this.postService.posts());
  userPosts = computed(() => this.postService.userPosts());

}
