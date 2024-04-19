import { Component, OnInit } from '@angular/core';
import { ProfileUpdateService } from 'src/app/Service/ProfileUpdateService/profile-update-service.service';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  token: string | null;
  userId: any;
  fileName: any;
  firstName: any;
  lastName: any;
  email: any;
  role: any;
  userName: any;
  selectedFile: File | null = null;
  profileImage!: File | null;
  user: any = {};

  constructor(private userService: UserService,private profileUpdateService: ProfileUpdateService) {
    this.token = localStorage.getItem('jwtToken');

  }

  ngOnInit(): void {
    this.getInfo();
  }
  getInfo(): void {

    if (this.token) {
      this.userService.getUserInfo(this.token).subscribe((data) => { // Assuming the response contains the user information in JSON format
        this.userId = data.id;
        this.fileName = data.image;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.role = data.role;
        this.userName = data.username;

      }, (error) => {
        console.error('Error fetching user information:', error);
      });
    } else {
      console.error('Token not found in localStorage');
    }
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updateProfile(): void {
    if (!this.token || !this.userId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Token or User ID is missing',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    // Create FormData object
    const formData = new FormData();
    formData.append('id', this.userId);
    formData.append('username', this.userName);
    formData.append('firstName', this.firstName);
    formData.append('lastName', this.lastName);
    formData.append('email', this.email);
    // Append the file
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }
  
    // Send the FormData object to the backend
    this.userService.updateProfile(formData, this.token).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Profile updated successfully',
          confirmButtonText: 'OK'
        });
        // Optionally, update any UI elements or show success message
        this.profileUpdateService.triggerProfileUpdated();
      },
      (error) => {
        console.error('Error updating profile:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update profile. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  
}





