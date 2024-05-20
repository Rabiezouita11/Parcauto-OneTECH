import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { ScriptStyleLoaderService } from 'src/app/Service/script-style-loader/script-style-loader.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ScriptService } from 'src/app/Service/script/script.service';
import { Vehicle } from 'src/app/model/Vehicle';
import { VehicleService } from 'src/app/Service/VehicleService/vehicle-service.service';
import { User } from 'src/app/model/user';
import { ReservationService } from 'src/app/Service/Reservation/reservation.service';
import { Reservation } from 'src/app/model/Reservation';
@Component({ selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.scss'] })
export class HomeComponent implements OnInit {
  token: string | null;
  vehicles !: Vehicle[];
  reservations !: Reservation[];

  vehicleCount !: number;
  usersCount !: number;

  role: any;
  users!: User[];
  reservationCount!: number;

  constructor(private reservationService: ReservationService ,private vehicleService: VehicleService, private userService: UserService) {
    this.token = localStorage.getItem('jwtToken');

  }

  ngOnInit(): void {
    this.getInfo();

    this.getAllVehicles();
    this.countUtilisateurs();
    this.getAllReservations();

  }
  getInfo(): void {

    if (this.token) {
      this.userService.getUserInfo(this.token).subscribe((data) => { // Assuming the response contains the user information in JSON format

        this.role = data.role;


      }, (error) => {
        console.error('Error fetching user information:', error);
      });
    } else {
      console.error('Token not found in localStorage');
    }
  }
  getAllVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
      this.vehicleCount = vehicles.length; // Set the count of vehicles
    }, error => {
      console.error('Error fetching vehicles:', error);
    });
  }
  getAllReservations(): void {
    this.reservationService.getAllReservations().subscribe(
      data => {
        this.reservations = data;
        this.reservationCount = data.length
      },
      error => console.error('Error fetching reservations', error)
    );
  }
  countUtilisateurs(): void {
    this.userService.getConducteursAndChefs().subscribe(
      (users: User[]) => {
        this.users = users;
        this.usersCount = users.length; // Set the count of vehicles

        console.log(this.users)
      },
      (error) => {
        console.error('Error fetching conducteurs and chefs:', error);
      }
    );
  }
}
