import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CustomResponse } from '../../modals/modals';
import { DataService } from '../../services/data.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-manage-posts',
  templateUrl: './manage-posts.component.html',
  styleUrl: './manage-posts.component.css'
})
export class ManagePostsComponent {
  router = inject(Router);
  dataService = inject(DataService);
  postService = inject(PostService);

  constructor() {
    if(!localStorage.getItem('role')){
      this.router.navigate(['/admin/login'])
    }
  }

  // loadData() {
  //   this.dataService.loadingSubject.next(true);
  //   this.postService.getAllPosts("").subscribe({
  //     next: (response: CustomResponse) => {
  //       this.dataService.loadingSubject.next(false);
  //       this.postService.posts.update(current => [...current,...response.data]);
  //       this.postService.isDisplayingAdmin.set(true);
  //     },
  //   })
  // }

  // scroll() {
  //   this.postService.offset+=this.postService.itemsPerPage;
  //   this.loadData();
  // }

  ngOnDestroy() {
    this.postService.isDisplayingAdmin.set(false);
  }
}
