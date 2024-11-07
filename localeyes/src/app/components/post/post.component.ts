import { Component, inject, input } from '@angular/core';

import { Post } from '../../modals/modals';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  post = input.required<Post>();
  isHighlight: Boolean = false;
  service = inject(PostService);

  like() {
    if (this.isHighlight){
      return
    } else {
      this.service.LikePost(this.post().post_id).subscribe({
        next: () => {
          this.service.posts.update((posts) => 
            posts.map((post) => 
              post.post_id === this.post().post_id ?
              { ...post, likes: Number(post.likes)+1 } : post
            )
          )
          console.log('post liked')
        }
      });
      this.isHighlight = !this.isHighlight;
    }
  }
  openPost() {
    this.service.activePostId.set(this.post().post_id);
    this.service.isPostClicked.set(true);
  }
}
