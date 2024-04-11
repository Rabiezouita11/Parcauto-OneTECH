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
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: response.message,
          confirmButtonText: 'OK'
        }).then(() => {
          // Check if the user is ADMIN
          const token = localStorage.getItem('jwtToken');
          if (token) {
            this.userService.getUserInfo(token).subscribe(
              (data) => {
                if (data.role === 'ADMIN') {
                  this.router.navigateByUrl('/dashboard', { skipLocationChange: false });
                } else if (data.role === 'CHEF_DEPARTEMENT') {
                  this.router.navigateByUrl('/Chef_Departement/dashboard', { skipLocationChange: false });
                } else if (data.role === 'CONDUCTEUR') {
                  this.router.navigateByUrl('/conducteur/dashboard', { skipLocationChange: false });
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
        });
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


