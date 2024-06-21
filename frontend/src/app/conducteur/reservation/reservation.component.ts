import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReservationService } from 'src/app/Service/Reservation/reservation.service';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { Reservation } from 'src/app/model/Reservation';
import Swal from 'sweetalert2';
import { ReservationDetailsModalComponent } from './reservation-details-modal/reservation-details-modal.component';
import { WebSocketService } from 'src/app/Service/WebSocket/web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  reservations: Reservation[] = [];
  notificationSubscription: Subscription | undefined;

  constructor( private webSocketService: WebSocketService,  private dialog: MatDialog,private reservationService: ReservationService, private userService: UserService) { } // Inject UserService

  ngOnInit(): void {
        this.getAllReservations();
        this.initializeWebSocketConnection(); // Initialize WebSocket connection

  }

  initializeWebSocketConnection(): void {
    this.webSocketService.connect().then(() => {
       
      // Subscribe to notifications for admin
      this.notificationSubscription = this.webSocketService.getNotificationObservable().subscribe(notification => {
       
        this.getAllReservations();


      
      
    
  
        // Add new notification to the ADMIN notifications list
       
      });
    }).catch(error => {
      console.error('WebSocket connection error:', error);
    });
  }
  openDetailsModal(reservation: any): void {
    this.dialog.open(ReservationDetailsModalComponent, {
      width: '400px',
      data: reservation
    });
  }

  getAllReservations(): void {
    this.reservationService.getAllReservations().subscribe(
      data => {
        this.reservations = data;
        this.populateConnectedUserNames();
      },
      error => console.error('Error fetching reservations', error)
    );
  }
  populateConnectedUserNames(): void {
    for (const reservation of this.reservations) {
      if (reservation.userIdConnected) {
        this.reservationService.getUsernameById(reservation.userIdConnected).subscribe(
          username => reservation.connectedUserName = username,
          error => console.error('Error fetching user details', error)
        );
      }
    }
  }
  
  confirmAcceptReservation(reservation: Reservation): void {
    Swal.fire({
      title: 'Accepter la réservation?',
      text: `Voulez-vous vraiment accepter la réservation pour ${reservation.connectedUserName?.username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, accepter',
      cancelButtonText: 'Non, annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.acceptReservation(reservation);
      }
    });
  }

  acceptReservation(reservation: Reservation): void {
    reservation.status = true; // Set status to accepted
    this.reservationService.updateReservationStatus(reservation.id, true).subscribe(
      () => this.getAllReservations(),
      error => console.error('Error updating reservation status', error)
    );
  }
  confirmRejectReservation(reservation: Reservation): void {
    Swal.fire({
      title: 'Refuser la réservation?',
      text: `Voulez-vous vraiment refuser la réservation pour ${reservation.connectedUserName?.username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, refuser',
      cancelButtonText: 'Non, annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.rejectReservation(reservation);
      }
    });
  }

  rejectReservation(reservation: Reservation): void {
    reservation.status = false; // Set status to rejected
    this.reservationService.updateReservationStatus(reservation.id, false).subscribe(
      () => this.getAllReservations(),
      error => console.error('Error updating reservation status', error)
    );
  }
}
