import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js/auto';
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
import { Report } from 'src/app/model/Report';
@Component({ selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.scss'] })
export class HomeComponent implements OnInit ,AfterViewInit {
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
  reports!: Report[];
  reportCount: number=0;
  reportCountNoUserId:  number=0;
  CarburantsCountNoUserId:number=0;


  @Input() chartData: any;
  @ViewChild('chart') chartRef!: ElementRef;

  constructor( private ConducteurService : ConducteurService ,private reservationService: ReservationService, private vehicleService: VehicleService, private userService: UserService) {
    this.token = localStorage.getItem('jwtToken');

  }
  ngAfterViewInit() {
    // Call getAllReservations to fetch reservation data and update chartData
    this.getAllReservations();
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
        this.reservationCount = data.length;
        this.pendingReservations = data.filter(reservation => reservation.status === null);
        this.acceptedReservations = data.filter(reservation => reservation.status === true);
        this.refusedReservations = data.filter(reservation => reservation.status === false);
  
        // Update chartData with counts
        this.chartData = [
          this.pendingReservations.length,
          this.acceptedReservations.length,
          this.refusedReservations.length
        ];
  
        // Call a separate method to create the chart
        this.createChart();
      },
      error => console.error('Error fetching reservations', error)
    );
  }
  
  createChart(): void {
    // Access the native element inside ngAfterViewInit
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }
    // Create the chart after the view has been initialized
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pending', 'Accepted', 'Refused'],
        datasets: [{
          label: 'Reservations',
          data: this.chartData, // Use the updated chartData
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
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
