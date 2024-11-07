import { Component, inject } from '@angular/core';
import { Filters } from '../../constants/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewPost } from '../../modals/modals';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent {
  filters = Filters;
  newPost:NewPost = {
    title: '',
    content: '',
    type: ''
  }
  form = new FormGroup({
    title: new FormControl('',[Validators.required]),
    content: new FormControl('',[Validators.required]),
    selectedFilter: new FormControl('',[Validators.required])
  });
  service = inject(PostService);

  submit() {
    if(this.form.valid){
      console.log(this.form);
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
        next: () => this.form.reset()
      })
    }
  }
}
