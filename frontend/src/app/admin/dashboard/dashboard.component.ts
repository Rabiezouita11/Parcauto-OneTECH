import {Component, OnInit} from '@angular/core';
import {UserService} from 'src/app/Service/UserService/user-service.service';

@Component({selector: 'app-dashboard', templateUrl: './dashboard.component.html', styleUrls: ['./dashboard.component.scss']})
export class DashboardComponent implements OnInit {
    firstName !: string;

    constructor(private userService : UserService) {}

    ngOnInit(): void {
        this.getUserFirstName();

    }
    getUserFirstName(): void {
        const token = localStorage.getItem('jwtToken');

        if (token) {
            this.userService.getUserInfo(token).subscribe((data) => { // Assuming the response contains the user information in JSON format
                this.firstName = data.firstName;
            }, (error) => {
                console.error('Error fetching user information:', error);
            });
        } else {
            console.error('Token not found in localStorage');
        }
    }
}
