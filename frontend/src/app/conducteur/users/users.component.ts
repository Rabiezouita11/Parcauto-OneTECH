import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { User } from 'src/app/model/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users!: User[];
  loading: boolean = false;
  loadingUser: number | null = null; // Track which user's action is being processed

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getConducteursAndChefs();

  }

  getConducteursAndChefs(): void {
    this.userService.getConducteursAndChefs().subscribe(
      (users: User[]) => {
        this.users = users;
        console.log(this.users)
      },
      (error) => {
        console.error('Error fetching conducteurs and chefs:', error);
      }
    );
  }

  acceptUser(user: any) {
    this.userService.showConfirmationDialogAccepter(user.firstName, () => {
      this.loadingUser = user.id; // Set loadingUser to indicate which user's action is in progress
      this.loading = true;
      this.userService.updateUserStatus(user.id, true).subscribe(() => {
        this.loading = false;
        this.loadingUser = null; // Reset loadingUser when request is successful
        this.ngOnInit();
        Swal.fire({
          icon: 'success',
          title: 'User Accepted',
          text: `User ${user.firstName} has been accepted successfully.`,
          confirmButtonText: 'OK'
        });
      });
    }, () => {
      // Reject callback
    });
  }
  
  rejectUser(user: any) {
    this.userService.showConfirmationDialogRefuser(user.firstName, () => {
      this.loadingUser = user.id; // Set loadingUser to indicate which user's action is in progress
      this.loading = true;
      this.userService.updateUserStatus(user.id, false).subscribe(() => {
        this.loading = false;
        this.loadingUser = null; // Reset loadingUser when request is successful
        this.ngOnInit();
        Swal.fire({
          icon: 'success',
          title: 'User Rejected',
          text: `User ${user.firstName} has been rejected successfully.`,
          confirmButtonText: 'OK'
        });
      });
    }, () => {
      // Reject callback
    });
  }

  changeRole(userId: number, newRole: string) {
    console.log(userId);
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return;
    }
    
    // Call your service method here to change user's role
    this.userService.changeUserRole(userId, newRole).subscribe(() => {
      // Update user's role locally
      user.role = newRole;
      // Close the modal
      const modalId = 'roleChangeModal' + userId;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.dispatchEvent(new Event('hidden.bs.modal'));
      }
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User role changed successfully!',
        confirmButtonText: 'OK'
      });
    }, error => {
      // Handle error
      console.error('Error changing user role:', error);
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to change user role. Please try again later.',
        confirmButtonText: 'OK'
      });
    });
  }
  
}
