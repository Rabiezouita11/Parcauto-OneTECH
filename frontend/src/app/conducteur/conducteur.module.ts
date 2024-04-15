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


@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    ConducteurComponentComponent,
    HeaderComponent,
    FooterComponent,
    VehiculeComponent
  ],
  imports: [
    CommonModule,
    ConducteurRoutingModule,
    FormsModule, // Import the FormsModule here
    ReactiveFormsModule ,
    MatProgressSpinnerModule
  ]
})
export class ConducteurModule { }
