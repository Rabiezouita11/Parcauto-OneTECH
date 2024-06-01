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
import { ConducteurService } from 'src/app/Service/Conducteur/conducteur.service';
import { Carburant } from 'src/app/model/Carburant';
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
  userIdConnected : any;
  pendingReservations: any[] = [];
  acceptedReservations: any[] = [];
  refusedReservations: any[] = [];
  carburants: Carburant[] = []; // To store carburant data
  carburantsCount: number = 0;
  reports!: import("c:/Users/bouden/Desktop/projet nour jbali pfe/frontend/src/app/model/report").Report[];
  reportCount: number=0;
  reportCountNoUserId:  number=0;
  CarburantsCountNoUserId:number=0;

  constructor( private ConducteurService : ConducteurService ,private reservationService: ReservationService, private vehicleService: VehicleService, private userService: UserService) {
    this.token = localStorage.getItem('jwtToken');

  }

  async ngOnInit() {
    await this.getInfo();

    if (this.role === 'ADMIN') {
      this.getAllVehicles();
      this.countUtilisateurs();

  }
    this.getAllReservations();
    this.loadReservations();
    this.loadCarburants();
    this.loadReports();
   
  }
  


  async getInfo(): Promise<void> {
    const token = localStorage.getItem('jwtToken');

    if (token) {
        try {
            const data: any = await this.userService.getUserInfo(token).toPromise();
            this.role = data.role;
            this.userIdConnected = data.id;
           
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
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

  async loadReservations(): Promise<void> {
    console.log(this.userIdConnected);
    if (!this.userIdConnected) {
      console.error('User ID is not available');
      return;
    }

    try {
      const reservations = await this.reservationService.getReservationsByUserIdConnected(this.userIdConnected).toPromise();

      if (reservations) {
        this.pendingReservations = reservations.filter(reservation => reservation.status === null);
        this.acceptedReservations = reservations.filter(reservation => reservation.status === true);
        this.refusedReservations = reservations.filter(reservation => reservation.status === false);

        // Map reservations to FullCalendar events
       

        // Set events to calendarOptions
      } else {
        console.error('No reservations found');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  }
  async loadCarburants(): Promise<void> {
    this.ConducteurService.getAllCarburants().subscribe(carburants => {
        this.carburants = carburants;
        this.CarburantsCountNoUserId = carburants.length;
        this.carburantsCount = this.countCarburantselonUserid(this.userIdConnected); // Assuming userId is already defined
   console.log( this.carburantsCount)
    }, error => {
        console.error('Error loading carburants:', error);
    });
}
countCarburantselonUserid(userId: number): number {
  console.log("userId"+userId)
  return this.carburants.filter(carburant => carburant.userId == userId).length;
}

async loadReports(): Promise<void> {
  this.ConducteurService.getAllReport().subscribe(reports => {
      this.reports = reports;
      console.log(this.reports);
      this.reportCountNoUserId = reports.length;
      this.reportCount = this.countReportsByUserId(this.userIdConnected); // Assuming userId is already defined
      console.log(this.reportCount);
  }, error => {
      console.error('Error loading reports:', error);
  });
}

countReportsByUserId(userId: number): number {
  return this.reports.filter(report => report.userId == userId).length;
}
}
