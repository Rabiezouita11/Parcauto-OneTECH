import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {UserService} from 'src/app/Service/UserService/user-service.service';
import {ScriptStyleLoaderService} from 'src/app/Service/script-style-loader/script-style-loader.service';

@Component({selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.scss']})
export class HomeComponent implements OnInit {
    userId : any;
    fileName : any;
    token : string | null;
    imageUrl : string | undefined | null;
    firstName : any;
    lastName : any;
    email : any;
    constructor(private sanitizer : DomSanitizer, private http : HttpClient, private router : Router, private scriptStyleLoaderService : ScriptStyleLoaderService, private userService : UserService) {
        this.token = localStorage.getItem('jwtToken');

    }
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
            }, 1000);
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

        if (this.token) {
            this.userService.getUserInfo(this.token).subscribe((data) => { // Assuming the response contains the user information in JSON format
                this.userId = data.id;
                this.fileName = data.image;
                this.firstName = data.firstName;
                this.lastName = data.lastName;
                this.email = data.email;
                this.getImageUrl(); // Call getImageUrl after getting user info

            }, (error) => {
                console.error('Error fetching user information:', error);
            });
        } else {
            console.error('Token not found in localStorage');
        }
    }
    getImageUrl(): void {
        if (!this.fileName) { // Set imageUrl to null or provide a default image URL
            this.imageUrl = null; // or provide a default image URL: this.imageUrl = 'path/to/default/image.jpg';
            return; // Exit the method early
        }
        const headers = new HttpHeaders({
                'Authorization': `Bearer ${
                this.token
            }`
        });

        // Assuming your backend endpoint for retrieving images is '/api/images/'
        this.http.get(`http://localhost:8080/images/${
            this.userId
        }/${
            this.fileName
        }`, {headers, responseType: 'blob'}).subscribe((response : Blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.imageUrl = reader.result as string;
            };
            reader.readAsDataURL(response);
        }, (error) => {
            console.error('Error fetching image:', error);
        });
    }
    logout(): void { // Remove the JWT token from local storage
        localStorage.removeItem('jwtToken');

        // Redirect the user to the login page
        this.router.navigateByUrl('/auth/login');
    }

    generateAvatarSrc(firstName : string, lastName : string): SafeResourceUrl {
        try {
            const initials = `${
                firstName.charAt(0).toUpperCase()
            }${
                lastName.charAt(0).toUpperCase()
            }`;
            const svgString = `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'><text x='50' y='50' text-anchor='middle' alignment-baseline='central' font-size='40' fill='black'>${initials}</text></svg>`;
            const safeSvg = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString));
            return safeSvg;
        } catch (error) {
            console.error('Error generating avatar source:', error);
            return '';
        }
    }
    generateAvatarSrcBlanc(firstName : string, lastName : string): SafeResourceUrl {
        try {
            const initials = `${
                firstName.charAt(0).toUpperCase()
            }${
                lastName.charAt(0).toUpperCase()
            }`;
            const svgString = `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'><text x='50' y='50' text-anchor='middle' alignment-baseline='central' font-size='40' fill='white'>${initials}</text></svg>`;
            const safeSvg = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString));
            return safeSvg;
        } catch (error) {
            console.error('Error generating avatar source:', error);
            return '';
        }
    }
}
