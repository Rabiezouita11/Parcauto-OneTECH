import { Component, OnInit } from '@angular/core';
import { ScriptStyleLoaderService } from 'src/app/Service/script-style-loader/script-style-loader.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private scriptStyleLoaderService: ScriptStyleLoaderService) { }

  ngOnInit(): void {
    this.loadScriptsAndStyles();
  }

  loadScriptsAndStyles(): void {
    const SCRIPT_PATH_LIST = [
      'assets/conducteur/js/plugins.js',
      'assets/conducteur/js/designesia.js'
    ];
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

    // Load scripts and styles
    this.scriptStyleLoaderService.loadScripts(SCRIPT_PATH_LIST)
      .then(() => {
        this.scriptStyleLoaderService.loadStyles(STYLE_PATH_LIST)
          .then(() => {
            // Hide the loader after a delay of 1 second (1000 milliseconds)
            setTimeout(() => {
              this.hideLoader();
            }, 2000);
          });
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
