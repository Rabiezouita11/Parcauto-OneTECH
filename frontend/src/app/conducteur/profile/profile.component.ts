import { Component, OnInit ,Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ScriptStyleLoaderService } from 'src/app/Service/script-style-loader/script-style-loader.service';
import { ScriptService } from 'src/app/Service/script/script.service';
const SCRIPT_PATH_LIST =[

  'assets/conducteur/js/designesia.js' ,
  'assets/conducteur/js/plugins.js'
]
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private router : Router, private ScriptServiceService: ScriptService, private renderer: Renderer2 , private scriptStyleLoaderService: ScriptStyleLoaderService) { }

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
    this.loadScriptsAndStyles();
  }

  loadScriptsAndStyles(): void {
    const SCRIPT_PATH_LIST = [ 'assets/conducteur/js/designesia.js' ,'assets/conducteur/js/plugins.js'];
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
  logout(): void { // Remove the JWT token from local storage
    localStorage.removeItem('jwtToken');

    // Redirect the user to the login page after a delay
    setTimeout(() => {
        this.router.navigateByUrl('/auth/login');

        // Refresh the page to ensure a fresh state
        window.location.reload();
    }, 1000); // Adjust the delay as needed (in milliseconds)
}
}
