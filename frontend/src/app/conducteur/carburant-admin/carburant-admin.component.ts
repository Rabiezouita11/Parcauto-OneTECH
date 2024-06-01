import { Component, OnInit } from '@angular/core';
import { ConducteurService } from 'src/app/Service/Conducteur/conducteur.service';
import { ReservationService } from 'src/app/Service/Reservation/reservation.service';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { VehicleService } from 'src/app/Service/VehicleService/vehicle-service.service';
import { Carburant } from 'src/app/model/Carburant';

@Component({
  selector: 'app-carburant-admin',
  templateUrl: './carburant-admin.component.html',
  styleUrls: ['./carburant-admin.component.scss']
})
export class CarburantAdminComponent implements OnInit {
  carburants: Carburant[] = []; // To store carburant data
  token: string | null;

  constructor( private ConducteurService : ConducteurService ,private reservationService: ReservationService, private vehicleService: VehicleService, private userService: UserService) {
    this.token = localStorage.getItem('jwtToken');

  }
  ngOnInit(): void {
    this.loadCarburants();

  }
  async loadCarburants(): Promise<void> {
    this.ConducteurService.getAllCarburants().subscribe(carburants => {
        this.carburants = carburants;
        
    }, error => {
        console.error('Error loading carburants:', error);
    });
}
}
