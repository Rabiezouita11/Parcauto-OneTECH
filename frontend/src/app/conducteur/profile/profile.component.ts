import { Component, OnInit ,Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ScriptStyleLoaderService } from 'src/app/Service/script-style-loader/script-style-loader.service';
import { ScriptService } from 'src/app/Service/script/script.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private router : Router, private ScriptServiceService: ScriptService, private renderer: Renderer2 , private scriptStyleLoaderService: ScriptStyleLoaderService) { }

  ngOnInit(): void {
 
  }


  logout(): void { // Remove the JWT token from local storage
    localStorage.removeItem('jwtToken');

    // Redirect the user to the login page after a delay
    window.location.reload();

}
}
