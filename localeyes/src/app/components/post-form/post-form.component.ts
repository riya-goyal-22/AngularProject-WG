import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { Filters } from '../../constants/constants';
import { EditPost, NewPost } from '../../modals/modals';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent {
  filters = Filters;
  router = inject(Router);
  messageService = inject(MessageService);
  isEdit:boolean = false;
  newPost: NewPost = {
    title: '',
    content: '',
    type: ''
  }
  editPost: EditPost = {
    title: '',
    content: ''
  }

  ngOnInit() {
    if(this.router.url.includes("profile/edit-post")) {
      this.isEdit = true;
      this.form.get('title')?.setValue(this.service.activePost()?.title as string);
      this.form.get('content')?.setValue(this.service.activePost()?.content as string);
      this.form.get('selectedFilter')?.setValue(this.service.activePost()?.type as string);
      this.form.controls.selectedFilter.disable();
    }
  }

  form = new FormGroup({
    title: new FormControl('',[Validators.required]),
    content: new FormControl('',[Validators.required]),
    selectedFilter: new FormControl('',[Validators.required])
  });
  service = inject(PostService);

  submit() {
    if(this.form.valid){
      if(this.isEdit){
        console.log('is edit')
        if (this.form.controls.title.value &&
          this.form.controls.content.value){
            this.editPost = {
              title: this.form.controls.title.value,
              content: this.form.controls.content.value
            }
          }
          this.service.editPost(this.editPost).subscribe({
            next: () => {
              this.form.reset();
              this.router.navigate(['/profile']);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Successfully edited'
              })
            }
          })
        return
      }
      if (
        this.form.controls.title.value &&
        this.form.controls.content.value &&
        this.form.controls.selectedFilter.value
      ){
        this.newPost.title = this.form.controls['title'].value;
        this.newPost.content = this.form.controls.content.value;
        this.newPost.type = (this.form.controls.selectedFilter.value).toLowerCase();
      }
      this.service.createPost(this.newPost).subscribe({
        next: () => {
          this.form.reset();
          this.router.navigate(['/home'])
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully added post'
          })
        }
      })
    }
  }
}
