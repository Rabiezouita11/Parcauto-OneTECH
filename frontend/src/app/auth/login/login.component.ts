import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import Swal from 'sweetalert2';
import { ScriptAuthService } from 'src/app/Service/scriptAuth/script-auth.service';
import { ScriptService } from 'src/app/Service/script/script.service';
const SCRIPT_PATH_LIST =[
  "assets/auth/js/jquery-3.5.0.min.js", // Add jQuery link here
  "assets/auth/js/bootstrap.min.js",
  "assets/auth/js/imagesloaded.pkgd.min.js",
  "assets/auth/js/validator.min.js",
  "assets/auth/js/main.js"
]
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
  constructor(private ScriptServiceService: ScriptService, private renderer: Renderer2,private router: Router, private userService: UserService ,private scriptStyleLoaderService: ScriptAuthService
    ) { }

    ngOnInit(): void {
      
        SCRIPT_PATH_LIST.forEach(e=> {
            const scriptElement = this.ScriptServiceService.loadJsScript(this.renderer, e);
            scriptElement.onload = () => {
             console.log('loaded');
    
            }
            scriptElement.onerror = () => {
              console.log('Could not load the script!');
            }
    
          })
      const STYLE_PATH_LIST = [
        '../../../assets/auth/css/bootstrap.min.css',
        '../../../assets/auth/font/flaticon.css',
        '../../../assets/auth/style.css'
      ];
    
      Promise.all([
        this.scriptStyleLoaderService.loadStyles(STYLE_PATH_LIST)
      ]).then(() => {
        // All scripts and styles have finished loading
        // Call addNewClass function to add 'loaded' class
      }).catch(error => {
        console.error('Error loading scripts or styles:', error);
      });
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


