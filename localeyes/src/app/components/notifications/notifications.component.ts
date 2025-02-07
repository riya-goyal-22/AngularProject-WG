import { Component, computed, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CustomResponse } from '../../modals/modals';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  userService = inject(UserService);
  notifications = computed(()=> this.userService.userNotifications())

  ngOnInit() {
    this.userService.notifications().subscribe({
      next: (response: CustomResponse) => {
        this.userService.userNotifications.set(response.data)
      }
    })
  }
}
