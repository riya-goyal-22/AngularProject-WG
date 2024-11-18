import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../../services/admin.service';
import { User } from '../../modals/modals';
import { DataService } from '../../services/data.service';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {
  adminService = inject(AdminService);
  dataService = inject(DataService);
  router = inject(Router);
  users = computed(() => this.adminService.users()?.filter((user) => {
    return user.username != 'admin'
  }))

  searchForm = new FormGroup({
    searchControl: new FormControl<string>('')
  })
  
  constructor() {
    if(!localStorage.getItem('role')){
      this.router.navigate(['/admin/login'])
    }
  }

  ngOnInit() {
    this.setupSearchDebounce();
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
    this.adminService.offset = 0;
    this.loadData();
  }

  loadData() {
    this.dataService.loadingSubject.next(true);
    const searchTerm = this.searchForm.controls.searchControl.value || '';
    this.adminService.getAllUsers(searchTerm).subscribe({
      next: (response) => {
        this.dataService.loadingSubject.next(false);
        this.adminService.users.set(response.data)
        console.log(response.data)
      }
    })
  }

  appendData() {
    this.dataService.loadingSubject.next(true);
    const searchTerm = this.searchForm.controls.searchControl.value || '';
    this.adminService.getAllUsers(searchTerm).subscribe({
      next: (response) => {
        this.dataService.loadingSubject.next(false);
        this.adminService.users.update(current => [...current,...response.data]);
        console.log(response.data)
      }
    })
  }

  scroll() {
    this.adminService.offset = this.adminService.offset+this.adminService.limit;
    this.appendData();
  }
}
