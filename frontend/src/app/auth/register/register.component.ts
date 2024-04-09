import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { ScriptStyleLoaderService } from 'src/app/Service/script-style-loader/script-style-loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: any = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    role: '' 
  };
 
  constructor( private router: Router ,private scriptStyleLoaderService: ScriptStyleLoaderService, private userService: UserService) 
  { }

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

    this.scriptStyleLoaderService.loadScripts(SCRIPT_PATH_LIST);
    this.scriptStyleLoaderService.loadStyles(STYLE_PATH_LIST);
  }


  registerUser(): void {
    console.log(this.user);
    this.userService.register(this.user).subscribe(
      (response) => {
        console.log('Registration successful:', response.message);
        if (response.message === 'User already exist') {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'User already exists. Please try with a different username.',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'You have successfully registered.',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigateByUrl('/auth/login').then(() => {
              window.location.reload();
            });
          });
        }
      },
      (error) => {
        console.error('Registration failed:', error);
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Failed to register. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  




  }


