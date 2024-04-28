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
    CalenderComponent
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
  


  ]
})
export class ConducteurModule { }
