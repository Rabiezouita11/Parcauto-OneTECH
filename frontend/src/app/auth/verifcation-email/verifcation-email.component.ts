import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verifcation-email',
  templateUrl: './verifcation-email.component.html',
  styleUrls: ['./verifcation-email.component.scss']
})
export class VerifcationEmailComponent implements OnInit {
  verificationCode: string = '';
  token: string = ''; // Define token property

  constructor(private route: ActivatedRoute, private userService: UserService,private router: Router) {}

  ngOnInit(): void {
    // Retrieve token from URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log(this.token)

  });

  }

  verficationEmail(registerForm: NgForm): void {
    if (!this.verificationCode) {
      Swal.fire({
        icon: 'error',
        title: 'Verification Code Required',
        text: 'Please enter the verification code.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Call the verifyCode method with the token and verification code
    this.userService.verifyCode(this.verificationCode, this.token).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Email Verified',
          text: 'Your email has been verified successfully.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigateByUrl('/auth/login', { skipLocationChange: true });
        });
      },
      (error) => {
        console.error('Verification failed:', error);
        if (error.error.message.includes('User not found')) {
          Swal.fire({
            icon: 'error',
            title: 'User Not Found',
            text: 'User not found with the provided reset token.',
            confirmButtonText: 'OK'
          });
        } else if (error.error.message.includes('Incorrect verification code')) {
          Swal.fire({
            icon: 'error',
            title: 'Incorrect Verification Code',
            text: 'The verification code you entered is incorrect.',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Verification Failed',
            text: 'Failed to verify email. Please try again later.',
            confirmButtonText: 'OK'
          });
        }
      }
    );
}

  

  resetForm(form: NgForm): void {
    form.resetForm(); // Reset the form
  }
}
