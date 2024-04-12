import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Component, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from 'src/app/Service/UserService/user-service.service';
import {ScriptStyleLoaderService} from 'src/app/Service/script-style-loader/script-style-loader.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ScriptService} from 'src/app/Service/script/script.service';
@Component({selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.scss']})
export class HomeComponent implements OnInit {
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


    }


}
