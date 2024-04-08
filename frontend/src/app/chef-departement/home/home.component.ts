import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from 'src/app/Service/UserService/user-service.service';
import {ScriptStyleLoaderService} from 'src/app/Service/script-style-loader/script-style-loader.service';

@Component({selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.scss']})
export class HomeComponent implements OnInit {
    firstName !: string;

    constructor(private router:Router , private scriptStyleLoaderService : ScriptStyleLoaderService, private userService : UserService) {}

    ngOnInit(): void {
        this.loadScriptsAndStyles();
        this.getUserFirstName();

    }

    loadScriptsAndStyles(): void {
        const SCRIPT_PATH_LIST = ['assets/conducteur/js/plugins.js', 'assets/conducteur/js/designesia.js'];
        const STYLE_PATH_LIST = [
            'assets/conducteur/css/bootstrap.min.css',
            'assets/conducteur/css/mdb.min.css',
            'assets/conducteur/css/plugins.css',
            'assets/conducteur/css/style.css',
            'assets/conducteur/css/coloring.css',
            'assets/conducteur/css/colors/scheme-01.css'
        ];

        // Show the loader
        this.showLoader();

        // Load scripts and styles concurrently
        Promise.all([this.scriptStyleLoaderService.loadScripts(SCRIPT_PATH_LIST), this.scriptStyleLoaderService.loadStyles(STYLE_PATH_LIST)]).then(() => { // Hide the loader after loading is complete
            setTimeout(() => {
                this.hideLoader();
            }, 2000);
        }).catch((error) => {
            console.error('Error loading scripts or styles:', error);
            // Handle error - for example, you could display an error message or retry loading
            this.hideLoader(); // Ensure loader is hidden even if there's an error
        });
    }

    showLoader(): void {
        const loader = document.getElementById('de-preloader');
        if (loader) {
            loader.style.display = 'block';
        }
    }

    hideLoader(): void {
        const loader = document.getElementById('de-preloader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
    getUserFirstName(): void {
      const token = localStorage.getItem('jwtToken');
    
      if (token) {
        this.userService.getUserInfo(token).subscribe(
          (data) => {
            // Assuming the response contains the user information in JSON format
            this.firstName = data.firstName;
          },
          (error) => {
            console.error('Error fetching user information:', error);
          }
        );
      } else {
        console.error('Token not found in localStorage');
      }
    }
    
    logout(): void {
      // Remove the JWT token from local storage
      localStorage.removeItem('jwtToken');
    
      // Redirect the user to the login page
      this.router.navigateByUrl('/auth/login');
    }
    
    
}
