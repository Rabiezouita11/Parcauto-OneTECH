import { Component, OnInit } from '@angular/core';
import { ConducteurService } from 'src/app/Service/Conducteur/conducteur.service';
import { ReservationService } from 'src/app/Service/Reservation/reservation.service';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { VehicleService } from 'src/app/Service/VehicleService/vehicle-service.service';

@Component({
  selector: 'app-raports-admin',
  templateUrl: './raports-admin.component.html',
  styleUrls: ['./raports-admin.component.scss']
})
export class RaportsAdminComponent implements OnInit {
  token: string | null;
  reports!: import("c:/Users/bouden/Desktop/projet nour jbali pfe/frontend/src/app/model/report").Report[];


  constructor( private ConducteurService : ConducteurService ,private reservationService: ReservationService, private vehicleService: VehicleService, private userService: UserService) {
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
}
