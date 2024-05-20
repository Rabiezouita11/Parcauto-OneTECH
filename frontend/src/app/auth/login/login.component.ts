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
                if (data.emailVerified === "false") { // Check if email is not verified
                  Swal.fire({
                    icon: 'info',
                    title: 'Email non vérifié',
                    text: 'Veuillez vérifier votre email pour les instructions de vérification.',
                    confirmButtonText: 'OK'
                  }).then(() => {
                    const email = 'nourjbeli78@gmail.com'; // Email address to search for
                    const searchUrl = `https://mail.google.com/mail/u/0/#search/${email}`;
                
                    window.open(searchUrl, '_blank'); // Redirect to Gmail and search for the email
                  });
                }
                 else if (data.role === 'ADMIN' || data.role === 'CHEF_DEPARTEMENT' || data.role === 'CONDUCTEUR') {
                  if (data.status === 'null') {
                    Swal.fire({
                      icon: 'info',
                      title: 'Statut du compte',
                      text: 'Votre compte est actuellement en cours de révision. Vous serez notifié par email une fois qu\'il sera traité.',
                      confirmButtonText: 'OK'
                    });
                  } else if (data.status === "false") { // Check for false value (0)
                    Swal.fire({
                      icon: 'error',
                      title: 'Compte désactivé',
                      text: 'Votre compte est désactivé',
                      confirmButtonText: 'OK'
                    });
                  } else {
                    Swal.fire({
                      icon: 'success',
                      title: 'Accès accordé',
                      text: 'Vous avez accepté les termes et pouvez maintenant accéder à cette page',
                      confirmButtonText: 'OK'
                    }).then(() => {
                      this.router.navigateByUrl('/dashboard', { skipLocationChange: false });
                    });
                  }
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Accès refusé',
                    text: 'Vous n\'avez pas la permission d\'accéder à cette page.',
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
            title: 'Échec de la connexion',
            text: 'Échec de la connexion. Veuillez vérifier vos identifiants et réessayer.',
            confirmButtonText: 'OK'
          });
        }
      );
    }
    
    
    
    
    
    
    
    
  
  }


