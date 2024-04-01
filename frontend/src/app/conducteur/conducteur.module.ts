import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConducteurRoutingModule } from './conducteur-routing.module';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ConducteurRoutingModule
  ]
})
export class ConducteurModule { }
