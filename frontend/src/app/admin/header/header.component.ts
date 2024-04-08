import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  authenticated = false;
  listCommande : any =   []   
  constructor(private http:HttpClient, private router:Router) { }

  ngOnInit(): void {
   
  }
  logout(): void {
    // Remove the JWT token from local storage
    localStorage.removeItem('jwtToken');
  
    // Redirect the user to the login page
    this.router.navigateByUrl('/auth/login');
  }
  

}
