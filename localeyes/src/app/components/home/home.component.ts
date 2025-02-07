import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { PostService } from '../../services/post.service';
import { CustomResponse, User } from '../../modals/modals';
import { Filters } from '../../constants/constants';
import { UserService } from '../../services/user.service';
import { InvalidToken } from '../../constants/errors';
import { DataService } from '../../services/data.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  filters = Filters;
  postService = inject(PostService);
  userService = inject(UserService);
  dataService = inject(DataService);
  router = inject(Router);
  searchForm = new FormGroup({
    searchControl: new FormControl<string>('')
  })
  form = new FormGroup({
    selectedFilter: new FormControl<string | null>(null)
  });

  hasMorePosts = true;


  ngOnInit() {
    setTimeout(() => {
      localStorage.removeItem('token');
    },3600000);

    this.userService.profile().subscribe({
      next: (response: CustomResponse) => {
        this.userService.user.set(response.data as User);
        this.loadPosts("");
      }
    })
    this.setupSearchDebounce();
    if (this.router.url.includes('manage-posts')) {
      if(!localStorage.getItem('role')){
        this.router.navigate(['/login'])
      }
    }
  }

  setupSearchDebounce() {
    this.searchForm.controls.searchControl.valueChanges.pipe(
      debounceTime(900),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.handleSearch(searchTerm || '');
    });
  }

  handleSearch(search: string) {
    this.postService.offset = 0;
    this.hasMorePosts = true;
    this.dataService.loadingSubject.next(true);
    const currentFilter = this.form.get('selectedFilter')?.value;
    
    if (currentFilter) {
      this.loadFilterPosts(currentFilter, search);
    } else {
      this.loadPosts(search);
    }
  }

  loadPosts(search: string) {
    this.postService.getAllPosts(search).subscribe({
      next: (response: CustomResponse) => {
        this.dataService.loadingSubject.next(false);
        this.postService.posts.set(response.data);
      },
      error: (err) => {
        this.dataService.loadingSubject.next(false);
        if(err.error.message === InvalidToken) {
          this.router.navigate(['/login'])
        }
      }
    })
  }

  loadFilterPosts(filter: string ,search: string) {
    this.postService.getFilteredPosts((filter),search).subscribe({
      next: (response: CustomResponse) => {
        this.dataService.loadingSubject.next(false);
        this.postService.posts.set(response.data);
        console.log(response.data)
      },
      error: (err) => {
        this.dataService.loadingSubject.next(false);
        if(err.error.message === InvalidToken) {
          this.router.navigate(['/login'])
        }
      }
    })
  }

  appendData() {
    const currentFilter = this.form.get('selectedFilter')?.value;
    const searchTerm = this.searchForm.controls.searchControl.value || '';

    if (currentFilter) {
      this.postService.getFilteredPosts(currentFilter,searchTerm).subscribe({
        next: (response: CustomResponse) => {
          this.dataService.loadingSubject.next(false);
          if (response.data && response.data.length < this.postService.itemsPerPage) {
            this.hasMorePosts = false;
          }
          if (response.data ! = null) {
            this.postService.posts.update(current => [...current, ...response.data]);
          }
        },
        error: (err) => {
          this.dataService.loadingSubject.next(false);
          if (err.error.message === InvalidToken) {
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      this.postService.getAllPosts(searchTerm).subscribe({
        next: (response: CustomResponse) => {
          this.dataService.loadingSubject.next(false);
          if (response.data && response.data.length < this.postService.itemsPerPage) {
            this.hasMorePosts = false;
          }
          if (response.data ! = null) {
            this.postService.posts.update(current => [...current, ...response.data]);
          }
        },
        error: (err) => {
          this.dataService.loadingSubject.next(false);
          if (err.error.message === InvalidToken) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  scroll() {
    this.dataService.loadingSubject.next(true);
    this.postService.offset += this.postService.itemsPerPage;
    this.appendData();
  }

  dropdownChange(event: any) {
    this.postService.offset = 0;
    this.hasMorePosts = true;

    const searchTerm = this.searchForm.controls.searchControl.value || '';

    if(event.value) {
      this.dataService.loadingSubject.next(true);
      this.userService.profile().subscribe({
        next: (response: CustomResponse) => {
          this.userService.user.set(response.data as User);
          this.loadFilterPosts(event.value,searchTerm)
        }
      })
    }else{
      this.dataService.loadingSubject.next(true);
      this.userService.profile().subscribe({
        next: (response: CustomResponse) => {
          this.userService.user.set(response.data as User);
          this.loadPosts(searchTerm)
        }
      })
    }
  }

  ngOnDestroy() {
    if (this.router.url.includes('manage-posts')) {
      this.postService.isDisplayingAdmin.set(false);
    }
  }
}
