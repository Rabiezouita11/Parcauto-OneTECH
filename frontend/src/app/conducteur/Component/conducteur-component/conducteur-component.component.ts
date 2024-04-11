import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { ScriptStyleLoaderService } from 'src/app/Service/script-style-loader/script-style-loader.service';
import { ScriptService } from 'src/app/Service/script/script.service';

@Component({
  selector: 'app-conducteur-component',
  templateUrl: './conducteur-component.component.html',
  styleUrls: ['./conducteur-component.component.scss']
})
export class ConducteurComponentComponent implements OnInit {

  userId : any;
  fileName : any;
  token : string | null;
  imageUrl : string | undefined | null;
  firstName : any;
  lastName : any;
  email : any;
  constructor(private ScriptServiceService : ScriptService, private renderer : Renderer2, private sanitizer : DomSanitizer, private http : HttpClient, private router : Router, private scriptStyleLoaderService : ScriptStyleLoaderService, private userService : UserService) {
      this.token = localStorage.getItem('jwtToken');

  }
  ngOnInit(): void {
    

  this.loadScriptsAndStyles();

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
  const SCRIPT_PATH_LIST = [ 'assets/conducteur/js/plugins.js', 'assets/conducteur/js/designesia.js']

  // Show the loader
  this.showLoader();

  // Load scripts and styles concurrently
  Promise.all([  this.scriptStyleLoaderService.loadScripts(SCRIPT_PATH_LIST) , this.scriptStyleLoaderService.loadStyles(STYLE_PATH_LIST)]).then(() => { // Hide the loader after loading is complete
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
}
