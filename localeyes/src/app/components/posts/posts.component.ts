import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { CustomResponse } from '../../modals/modals';
import { Filters } from '../../constants/constants';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {
  filters = Filters;
  service = inject(PostService)
  form = new FormGroup({
    selectedFilter: new FormControl(null)
  })
  options = ['All Posts','My Posts'];

  ngOnInit() {
    setTimeout(() => {
      localStorage.removeItem('token');
    },3600000);
    this.service.getAllPosts().subscribe({
      next: (response: CustomResponse) => {
        this.service.posts.set(response.data)
      }
    })
  }
}
