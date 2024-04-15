import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Component, OnInit, Renderer2} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { ProfileUpdateService } from 'src/app/Service/ProfileUpdateService/profile-update-service.service';
import {UserService} from 'src/app/Service/UserService/user-service.service';
import {ScriptStyleLoaderService} from 'src/app/Service/script-style-loader/script-style-loader.service';
import {ScriptService} from 'src/app/Service/script/script.service';
const SCRIPT_PATH_LIST = ['assets/conducteur/js/plugins.js']

@Component({selector: 'app-conducteur-component', templateUrl: './conducteur-component.component.html', styleUrls: ['./conducteur-component.component.scss']})
export class ConducteurComponentComponent implements OnInit {
    pageTitle: string = '';
    loading = false;

    userId : any;
    fileName : any;
    token : string | null;
    imageUrl : string | undefined | null;
    firstName : any;
    lastName : any;
    email : any;
    role: any;
    constructor(private profileUpdateService: ProfileUpdateService ,private route: ActivatedRoute ,private ScriptServiceService : ScriptService, private renderer : Renderer2, private sanitizer : DomSanitizer, private http : HttpClient, private router : Router, private scriptStyleLoaderService : ScriptStyleLoaderService, private userService : UserService) {
        this.token = localStorage.getItem('jwtToken');

    }
    reloadData(): void {
        this.getUserFirstName();
      }
    ngOnInit(): void {


        this.profileUpdateService.profileUpdated$.subscribe(() => {
            // Reload the data in this component
            this.reloadData();
          });

        this.route.data.subscribe((data: Data) => {
            // Update pageTitle based on the data received from the route
            this.pageTitle = data['title'] || 'aaaaa';
          });
      
        SCRIPT_PATH_LIST.forEach(e=> {
            const scriptElement = this.ScriptServiceService.loadJsScript(this.renderer, e);
            scriptElement.onload = () => {
             console.log('loaded');
      
            }
            scriptElement.onerror = () => {
              console.log('Could not load the script!');
            }
      
          })

        this.loadScriptsAndStyles();
        this.getUserFirstName();
     
    }
    getUserFirstName(): void {

        if (this.token) {
            this.userService.getUserInfo(this.token).subscribe((data) => { // Assuming the response contains the user information in JSON format
                this.userId = data.id;
                this.fileName = data.image;
                this.firstName = data.firstName;
                this.lastName = data.lastName;
                this.email = data.email;
                this.role = data.role;
                this.getImageUrl(); // Call getImageUrl after getting user info

            }, (error) => {
                console.error('Error fetching user information:', error);
            });
        } else {
            console.error('Token not found in localStorage');
        }
    }
    loadScriptsAndStyles(): void {
        const STYLE_PATH_LIST = [
            'assets/conducteur/css/bootstrap.min.css',
            'assets/conducteur/css/mdb.min.css',
            'assets/conducteur/css/plugins.css',
            'assets/conducteur/css/style.css',
            'assets/conducteur/css/coloring.css',
            'assets/conducteur/css/colors/scheme-01.css'
        ];
        const SCRIPT_PATH_LIST = ['assets/conducteur/js/plugins.js']

        // Show the loader
        this.loading = true;
        // Load scripts and styles concurrently
        Promise.all([this.scriptStyleLoaderService.loadScripts(SCRIPT_PATH_LIST), this.scriptStyleLoaderService.loadStyles(STYLE_PATH_LIST)]).then(() => { // Hide the loader after loading is complete
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        }).catch((error) => {
            console.error('Error loading scripts or styles:', error);
            this.loading = false;
        });
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

        // Redirect the user to the login page after a delay
        window.location.reload();

    }
}
