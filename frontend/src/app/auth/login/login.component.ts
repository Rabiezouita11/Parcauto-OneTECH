import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { ScriptStyleLoaderService } from 'src/app/Service/script-style-loader/script-style-loader.service';
import Swal from 'sweetalert2';

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
    contentLoaded: boolean = false;

  constructor(private router: Router, private userService: UserService ,private scriptStyleLoaderService: ScriptStyleLoaderService
    ) { }

  ngOnInit(): void {
    const SCRIPT_PATH_LIST = [
      "../../../assets/auth/js/jquery-3.5.0.min.js",
      "../../../assets/auth/js/bootstrap.min.js",
      "../../../assets/auth/js/imagesloaded.pkgd.min.js",
      "../../../assets/auth/js/validator.min.js",
      "../../../assets/auth/js/main.js"
    ];
    const STYLE_PATH_LIST = [
      '../../../assets/auth/css/bootstrap.min.css',
      '../../../assets/auth/font/flaticon.css',
      '../../../assets/auth/style.css'
    ];

    this.scriptStyleLoaderService.loadScripts(SCRIPT_PATH_LIST).then(() => {
      // Set contentLoaded to true when scripts are loaded
      this.contentLoaded = true;
    });    
    this.scriptStyleLoaderService.loadStyles(STYLE_PATH_LIST);
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
                  this.router.navigateByUrl('/dashboard', { skipLocationChange: false }).then(() => {
                    window.location.reload();
                  });
                } else if (data.role === 'CHEF_DEPARTEMENT') {
                  this.router.navigateByUrl('/Chef_Departement/dashboard', { skipLocationChange: false }).then(() => {
                    window.location.reload();
                  });
                } else if (data.role === 'CONDUCTEUR') {
                  this.router.navigateByUrl('/conducteur/dashboard', { skipLocationChange: false }).then(() => {
                    window.location.reload();
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


