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
      this.userService.updateUserStatus(user.id, true).subscribe(() => {
        // Update the UI or handle success
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
      this.userService.updateUserStatus(user.id, false).subscribe(() => {
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

}
