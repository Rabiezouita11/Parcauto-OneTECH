import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from 'src/app/Service/UserService/user-service.service';
import {ScriptStyleLoaderService} from 'src/app/Service/script-style-loader/script-style-loader.service';

@Component({selector: 'app-auth-component', templateUrl: './auth-component.component.html', styleUrls: ['./auth-component.component.scss']})
export class AuthComponentComponent implements OnInit {
    isLoginPage!: boolean;

    constructor(    private renderer: Renderer2,
        private elRef: ElementRef ,private router : Router, private userService : UserService, private scriptStyleLoaderService : ScriptStyleLoaderService) {}
    ngOnInit(): void {
        const SCRIPT_PATH_LIST = [

            "../../../assets/auth/js/jquery-3.5.0.min.js",
            "../../../assets/auth/js/bootstrap.min.js",
            "../../../assets/auth/js/imagesloaded.pkgd.min.js",
            "../../../assets/auth/js/validator.min.js",
            "../../../assets/auth/js/main.js"
        ];
        const STYLE_PATH_LIST = ['../../../assets/auth/css/bootstrap.min.css', '../../../assets/auth/font/flaticon.css', '../../../assets/auth/style.css'];

        Promise.all([this.scriptStyleLoaderService.loadScripts(SCRIPT_PATH_LIST), this.scriptStyleLoaderService.loadStyles(STYLE_PATH_LIST)]).then(() => {
            this.addNewClass();

        }).catch(error => {
            console.error('Error loading scripts or styles:', error);
        });
        this.isLoginPage = this.router.url.includes('/auth/login');
       
    }
    addNewClass(): void {
        // Use Renderer2 to manipulate the DOM and add class 'loaded'
        const element = this.elRef.nativeElement.querySelector('.fxt-template-animation');
        this.renderer.addClass(element, 'loaded');
      }
}
