import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { ScriptStyleLoaderService } from 'src/app/Service/script-style-loader/script-style-loader.service';
import Swal from 'sweetalert2';
import * as jQuery from 'jquery';
// Extend jQuery interface to include imagesLoaded function
declare global {
  interface JQuery {
    imagesLoaded: any; // Adjust the type according to how imagesLoaded is defined
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: any = {
    username: '',
    password: ''
  };
  constructor(private router: Router, private userService: UserService ,private scriptStyleLoaderService: ScriptStyleLoaderService
    ) { }

    ngOnInit(): void {
  
    }
    

    
    loginUser(): void {
      this.userService.login(this.user).subscribe(
        (response) => {
          console.log('Login successful:', response.message);
          // Check if the user is ADMIN, CHEF_DEPARTEMENT, or CONDUCTEUR and status is true
          const token = localStorage.getItem('jwtToken');
          if (token) {
            this.userService.getUserInfo(token).subscribe(
              (data) => {
                console.log(data)
                if (data.role === 'ADMIN' || data.role === 'CHEF_DEPARTEMENT' || data.role === 'CONDUCTEUR') {
                  if (data.status === 'null') {
                    Swal.fire({
                      icon: 'info',
                      title: 'Account Status',
                      text: 'Your account is currently under review. You will be notified via email once it is processed.',
                      confirmButtonText: 'OK'

                    });
                  } else if (data.status === "false") { // Check for false value (0)
                    Swal.fire({
                      icon: 'error',
                      title: 'Account Disabled',
                      text: 'Your account is disabled',
                      confirmButtonText: 'OK'

                    });
                  } else {
                    Swal.fire({
                      icon: 'success',
                      title: 'Access Granted',
                      text: 'You have accepted the terms and can now access this page',
                      confirmButtonText: 'OK'
                    }).then(() => {
                      this.router.navigateByUrl('/dashboard', { skipLocationChange: false });
                    });
                  }
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Access Denied',
                    text: 'You do not have permission to access this page.',
                    confirmButtonText: 'OK'
                  });
                }
              },
              (error) => {
                console.error('Error fetching user information:', error);
              }
            );
          } else {
            console.error('Token not found in localStorage');
            // Redirect to login page if token is not available
            this.router.navigateByUrl('/login');
          }
        },
        (error) => {
          console.error('Login failed:', error);
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Failed to log in. Please check your credentials and try again.',
            confirmButtonText: 'OK'
          });
        }
      );
    }
    
    
    
    
  
  }


