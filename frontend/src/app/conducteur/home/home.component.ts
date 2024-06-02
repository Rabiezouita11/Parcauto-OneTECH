import {HttpClient, HttpHeaders} from '@angular/common/http';
import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import {Router} from '@angular/router';
import {Chart, registerables} from 'chart.js/auto';
import {UserService} from 'src/app/Service/UserService/user-service.service';
import {ScriptStyleLoaderService} from 'src/app/Service/script-style-loader/script-style-loader.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ScriptService} from 'src/app/Service/script/script.service';
import {Vehicle} from 'src/app/model/Vehicle';
import {VehicleService} from 'src/app/Service/VehicleService/vehicle-service.service';
import {User} from 'src/app/model/user';
import {ReservationService} from 'src/app/Service/Reservation/reservation.service';
import {Reservation} from 'src/app/model/Reservation';
import {ConducteurService} from 'src/app/Service/Conducteur/conducteur.service';
import {Carburant} from 'src/app/model/Carburant';
import {Report} from 'src/app/model/Report';
import { Loader } from '@googlemaps/js-api-loader';
@Component({selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.scss']})
export class HomeComponent implements OnInit,
AfterViewInit {
    token : string | null;
    vehicles !: Vehicle[];
    reservations !: Reservation[];

    vehicleCount !: number;
    usersCount !: number;

    role : any;
    users !: User[];
    reservationCount !: number;
    userIdConnected : any;
    pendingReservations : any[] = [];
    acceptedReservations : any[] = [];
    refusedReservations : any[] = [];
    carburants : Carburant[] = []; // To store carburant data
    carburantsCount : number = 0;
    reports !: Report[];
    reportCount : number = 0;
    reportCountNoUserId : number = 0;
    CarburantsCountNoUserId : number = 0;


    @Input()chartData : any;
    @ViewChild('chart')chartRef !: ElementRef;
    @ViewChild('carburantsChart')carburantsChartRef !: ElementRef;
    @ViewChild('rapportsChart') rapportsChartRef!: ElementRef;

    constructor(private http: HttpClient ,private ConducteurService : ConducteurService, private reservationService : ReservationService, private vehicleService : VehicleService, private userService : UserService) {
        this.token = localStorage.getItem('jwtToken');

    }
    ngAfterViewInit() { // Call getAllReservations to fetch reservation data and update chartData
        this.getAllReservations();
        this.loadCarburants();
        this.loadReports();


    }
    loadUsers(): void {
      this.userService.getConducteursAndChefs().subscribe(
        (users: User[]) => {
          this.users = users;
          this.usersCount = users.length;
          this.createChartUser();
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
    }
    createChartUser(): void {
      // Count the number of users for each role
      const roleCountsMap = new Map<string, number>();
      this.users.forEach(user => {
        const count = roleCountsMap.get(user.role) || 0;
        roleCountsMap.set(user.role, count + 1);
      });
    
      // Extract role labels and counts from the map
      const roleLabels = Array.from(roleCountsMap.keys());
      const roleCounts = Array.from(roleCountsMap.values());
    
      // Define background colors for each role
      const backgroundColors = roleLabels.map(role => {
        if (role === 'CHEF_DEPARTEMENT') {
          return '#78ca5c'; // Green for CHEF_DEPARTEMENT
        } else if (role === 'CONDUCTEUR') {
          return 'orange'; // Orange for CONDUCTEUR
        } else {
          return 'rgba(54, 162, 235, 0.2)'; // Default color
        }
      });
    
      const ctx = this.rapportsChartRef.nativeElement.getContext('2d');
      if (!ctx) {
        console.error('Canvas context is null.');
        return;
      }
    
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: roleLabels,
          datasets: [{
            label: 'User Count',
            data: roleCounts,
            backgroundColor: backgroundColors, // Use the defined background colors
            borderColor: 'rgba(54, 162, 235, 1)',
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
    
    
    async getAllReservationsMap(map: google.maps.Map): Promise<void> {
      try {
          let reservationsData: any;
  
          // Check user's role
          if (this.role === 'ADMIN') {
              // Fetch all reservations for admin
              reservationsData = await this.reservationService.getAllReservations().toPromise();
          } else if (this.role === 'CHEF_DEPARTEMENT') {
              // Fetch reservations based on user's ID for CHEF_DEPARTEMENT
              reservationsData = await this.reservationService.getReservationsByUserIdConnected(this.userIdConnected).toPromise();
          } else {
              console.error('Unknown role:', this.role);
              return;
          }
  
          if (reservationsData) {
              this.reservations = reservationsData;
              console.log("this.reservations: ", this.reservations);
              // Display markers for each reservation
              await this.displayMarkers(map);
          } else {
              console.error('No reservation data received.');
          }
      } catch (error) {
          console.error('Error fetching reservations:', error);
      }
  }
  
  
  async displayMarkers(map: google.maps.Map): Promise<void> {
    // Iterate over each reservation
    for (const reservation of this.reservations) {
        // Extract destination information from the reservation
        const destination = reservation.distiantion;

        // Geocode the destination to get its coordinates
        try {
            const coordinates = await this.geocodeDestination(destination);
            if (coordinates) {
                // Create a marker at the destination location
                const marker = new google.maps.Marker({
                    position: coordinates,
                    map: map,
                    title: reservation.mission // Optionally, set the marker title to reservation mission
                });

                // Optionally, add an info window with reservation details
                const infoWindow = new google.maps.InfoWindow({
                    content: `    <h3>${reservation.mission}</h3>
                    <p>Status: ${reservation.status ? 'Accepted' : 'Not Accepted'}</p>
                    <p>Terminé: ${reservation.statusReservation ? 'Oui' : 'Non'}</p>`
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
            }
        } catch (error) {
            console.error('Error geocoding destination:', error);
        }
    }
}

async geocodeDestination(destination: string): Promise<google.maps.LatLng | null> {
  const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`;
  try {
    const response: any = await this.http.get(apiUrl).toPromise();
    if (response && Array.isArray(response) && response.length > 0) {
      const firstResult = response[0];
      const coordinates = new google.maps.LatLng(parseFloat(firstResult.lat), parseFloat(firstResult.lon));
      return coordinates;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  return null;
}
    async ngOnInit() {

      let loader = new Loader({
        apiKey: 'AIzaSyDFK8e9zS74Z-dr_Om8a0sPGUPAepAlMp4',
      });
      loader.load().then(() => {
        let map = new google.maps.Map(document.getElementById('map')!, {
          center: { lat: 36.81897, lng: 10.16579 },
          zoom: 8,
        });
       this.getAllReservationsMap(map);

 });

        await this.getInfo();

        if (this.role === 'ADMIN') {
            this.getAllVehicles();
            this.countUtilisateurs();

        }
        this.getAllReservations();
        this.loadReservations();
        this.loadCarburants();
       
        this.loadUsers();


    }


    async getInfo(): Promise < void > {
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
        this.reservationService.getAllReservations().subscribe(data => {
            this.reservations = data;
            this.reservationCount = data.length;
            this.pendingReservations = data.filter(reservation => reservation.status === null);
            this.acceptedReservations = data.filter(reservation => reservation.status === true);
            this.refusedReservations = data.filter(reservation => reservation.status === false);

            // Update chartData with counts
            this.chartData = [this.pendingReservations.length, this.acceptedReservations.length, this.refusedReservations.length];

            // Call a separate method to create the chart
            this.createChart();
        }, error => console.error('Error fetching reservations', error));
    }

    createChart(): void { // Access the native element inside ngAfterViewInit
        const ctx = this.chartRef.nativeElement.getContext('2d');
        if (! ctx) {
            console.error('Canvas context is null.');
            return;
        }
        // Create the chart after the view has been initialized
        const myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'En cours', 'accepteé', 'refuseé'
                ],
                datasets: [
                    {
                        label: 'Reservations',
                        data: this.chartData, // Use the updated chartData
                        backgroundColor: [
                            'blue', '#78ca5c', 'orange'
                        ],
                        borderColor: [
                            'blue', '#78ca5c', 'orange'
                        ],
                        borderWidth: 1
                    }
                ]
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
        this.userService.getConducteursAndChefs().subscribe((users : User[]) => {
            this.users = users;
            this.usersCount = users.length; // Set the count of vehicles

            console.log(this.users)
        }, (error) => {
            console.error('Error fetching conducteurs and chefs:', error);
        });
    }

    async loadReservations(): Promise < void > {
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
    async loadCarburants(): Promise < void > {
        this.ConducteurService.getAllCarburants().subscribe(carburants => {
            this.carburants = carburants;
            this.CarburantsCountNoUserId = carburants.length;
            this.carburantsCount = this.countCarburantselonUserid(this.userIdConnected); // Assuming userId is already defined
            this.createCarburantsChart();

        }, error => {
            console.error('Error loading carburants:', error);
        });
    }
    createCarburantsChart(): void {
      const ctx = this.carburantsChartRef.nativeElement.getContext('2d');
      if (!ctx) {
        console.error('Canvas context is null.');
        return;
      }
      // Extract carburants data for chart
      const labels = this.carburants.map(carburant => `ID ${carburant.id}`);
      const dataQuantiteCarburant = this.carburants.map(carburant => carburant.quantiteCarburantUtiliser);
      const dataCarburantConsome = this.carburants.map(carburant => carburant.carburantConsome);
    
      // Create the pie chart using carburants data
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'Quantité de carburant utilisée',
            data: dataQuantiteCarburant,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Carburant consommé',
            data: dataCarburantConsome,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
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
    

    countCarburantselonUserid(userId : number): number {
        console.log("userId" + userId)
        return this.carburants.filter(carburant => carburant.userId == userId).length;
    }

    async loadReports(): Promise < void > {
        this.ConducteurService.getAllReport().subscribe(reports => {
            this.reports = reports;
            console.log(this.reports);
            this.reportCountNoUserId = reports.length;
            this.reportCount = this.countReportsByUserId(this.userIdConnected); // Assuming userId is already defined

        }, error => {
            console.error('Error loading reports:', error);
        });
    }

    countReportsByUserId(userId : number): number {
        return this.reports.filter(report => report.userId == userId).length;
    }

 
  
}
