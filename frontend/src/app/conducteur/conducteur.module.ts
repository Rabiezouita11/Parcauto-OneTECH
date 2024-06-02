import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ConducteurRoutingModule } from './conducteur-routing.module';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ConducteurComponentComponent } from './Component/conducteur-component/conducteur-component.component';
import { HeaderComponent } from './Component/header/header.component';
import { FooterComponent } from './Component/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehiculeComponent } from './vehicule/vehicule.component';
import { MatIconModule } from '@angular/material/icon';
import { VehicleDetailsModalComponent } from './vehicule/vehicle-details-modal/vehicle-details-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { VehiculeUpdateModalComponent } from './vehicule/vehicule-update-modal/vehicule-update-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UsersComponent } from './users/users.component';
import { CalenderComponent } from './calender/calender.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BrowserModule } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { ReservationComponent } from './reservation/reservation.component';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ReservationDetailsModalComponent } from './reservation/reservation-details-modal/reservation-details-modal.component';
import { CarburantConducteurComponent } from './carburant-conducteur/carburant-conducteur.component';
import { CarburantAdminComponent } from './carburant-admin/carburant-admin.component';
import { RaportsAdminComponent } from './raports-admin/raports-admin.component';
import { ReservationDetailsComponent } from './carburant-admin/reservation-details/reservation-details.component';
import { NewlinePipe } from '../newline.pipe';
import { VehicleDetailsComponent } from './carburant-admin/vehicle-details/vehicle-details.component';
import { HistoriqueComponent } from './vehicule/historique/historique.component';

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    ConducteurComponentComponent,
    HeaderComponent,
    FooterComponent,
    VehiculeComponent,
    VehicleDetailsModalComponent,
    VehiculeUpdateModalComponent,
    UsersComponent,
    CalenderComponent,
    ReservationComponent,
    ReservationDetailsModalComponent,
    CarburantConducteurComponent,
    CarburantAdminComponent,
    RaportsAdminComponent,
    ReservationDetailsComponent,
    NewlinePipe,
    VehicleDetailsComponent,
    HistoriqueComponent
  ],
  imports: [
    CommonModule,
    ConducteurRoutingModule,
    FormsModule, // Import the FormsModule here
    ReactiveFormsModule ,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule, // Add MatFormFieldModule here
    FullCalendarModule, // register FullCalendar with your app
    MatSelectModule,
    MatButtonToggleModule,
    



  ]
})
export class ConducteurModule { }
