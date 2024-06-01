import { Component, OnInit } from '@angular/core';
import { ConducteurService } from 'src/app/Service/Conducteur/conducteur.service';
import { ReservationService } from 'src/app/Service/Reservation/reservation.service';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { VehicleService } from 'src/app/Service/VehicleService/vehicle-service.service';
import { Report } from 'src/app/model/Report';
import { ReservationDetailsComponent } from '../carburant-admin/reservation-details/reservation-details.component';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-raports-admin',
  templateUrl: './raports-admin.component.html',
  styleUrls: ['./raports-admin.component.scss']
})
export class RaportsAdminComponent implements OnInit {
  token: string | null;
  reports: Report[] = []; // To store carburant data


  constructor( private dialog: MatDialog , private ConducteurService : ConducteurService ,private reservationService: ReservationService, private vehicleService: VehicleService, private userService: UserService) {
    this.token = localStorage.getItem('jwtToken');

  }

  ngOnInit(): void {
    this.loadReports();
  }
  async loadReports(): Promise<void> {
    this.ConducteurService.getAllReport().subscribe(reports => {
        this.reports = reports;
        console.log(this.reports);

      
    }, error => {
        console.error('Error loading reports:', error);
    });
  }

  openReservationModal(reservationId: number): void {
    // Call your service to retrieve all reservations
    this.reservationService.getAllReservations().subscribe(reservations => {
      // Find the reservation corresponding to the given ID
      const selectedReservation = reservations.find(reservation => reservation.id === reservationId);
  
      if (selectedReservation) {
        // Call your service to populate connectedUserName for each reservation
        const observables = [
          ...reservations
            .filter(reservation => reservation.userIdConnected)
            .map(reservation => this.reservationService.getUsernameById(reservation.userIdConnected)),
          this.reservationService.getUsernameById(selectedReservation.user.id)
        ];
  
        // Wait for all observables to complete
     // Wait for all observables to complete
  forkJoin(observables).subscribe(usernames => {
    const connectedUserNames = usernames.slice(0, -1);
    const mainUserName = usernames.slice(-1)[0];
  
    reservations.forEach((reservation, index) => {
      reservation.connectedUserName = connectedUserNames[index];
    });
  
    // Check if the main username is an object { username: string } or a string directly
    selectedReservation.user.username = typeof mainUserName === 'object' ? mainUserName.username : mainUserName;
  
    // Now that all reservations have their connectedUserName populated and the main username is set, open the dialog
    this.dialog.open(ReservationDetailsComponent, {
      width: '400px',
      data: selectedReservation
    });
  }, error => {
    console.error('Error fetching user details', error);
  });
  
      } else {
        console.error('Reservation not found');
      }
    }, error => {
      console.error('Error loading reservations:', error);
    });
  }
}
