import { Component, inject, input } from '@angular/core';

import { MessageService } from 'primeng/api';

import { DeleteUserModal, User } from '../../modals/modals';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  user = input.required<User>();
  adminService = inject(AdminService);
  messageService = inject(MessageService);
  userModel: DeleteUserModal = {
    username: '',
    email: ''
  }

  delete() {
    this.userModel.username = this.user().username
    this.userModel.email = this.user().email
    this.adminService.user.set(this.user());
    this.adminService.deleteUser(this.userModel).subscribe({
      next: () => {
        this.adminService.users.update(current => current?.filter((user) => {
          return user.id!=this.user().id
        }));
        this.messageService.add({
          severity: 'success',
          detail: 'Successful deletion'
        })
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          detail: 'Some issue at our end'
        })
      }
    })
  }

  reactivate() {
    this.adminService.user.set(this.user());
    this.adminService.reactivateUser().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          detail: 'User Reactivated successfully'
        })
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          detail: 'User is already active'
        })
      }
    })
  }
}
