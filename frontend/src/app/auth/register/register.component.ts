import { Component, OnInit, Renderer2 } from '@angular/core';
import { ScriptStyleLoaderService } from 'src/app/Service/script-style-loader/script-style-loader.service';
import { ScriptService } from 'src/app/Service/script/script.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

 
  constructor(private scriptStyleLoaderService: ScriptStyleLoaderService
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
      '../../../assets/auth/css/bootstrap-rtl.min.css',
      '../../../assets/auth/font/flaticon.css',
      '../../../assets/auth/style.css'
    ];

    this.scriptStyleLoaderService.loadScripts(SCRIPT_PATH_LIST);
    this.scriptStyleLoaderService.loadStyles(STYLE_PATH_LIST);
  }
  }


