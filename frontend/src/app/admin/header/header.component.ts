import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {UserService} from 'src/app/Service/UserService/user-service.service';

@Component({selector: 'app-header', templateUrl: './header.component.html', styleUrls: ['./header.component.scss']})
export class HeaderComponent implements OnInit {
    authenticated = false;
    listCommande : any = []

    userId : any;
    fileName : any;
    token : string | null;
    imageUrl : string | undefined | null;
    firstName: any;
    lastName: any;
    constructor(private userService : UserService, private http : HttpClient, private router : Router) {
        this.token = localStorage.getItem('jwtToken');

    }

    ngOnInit(): void {
        this.getData();

    }
    getData(): void {

        if (this.token) {
            this.userService.getUserInfo(this.token).subscribe((data) => { // Assuming the response contains the user information in JSON format
                console.log(data)
                this.userId = data.id;
                this.fileName = data.image;
                this.firstName = data.firstName;
                this.lastName = data.lastName;
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
        const headers = new HttpHeaders({'Authorization': `Bearer ${
                this.token
            }`});

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
        window.location.reload();
    }


}
