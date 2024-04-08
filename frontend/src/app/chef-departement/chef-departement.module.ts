import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChefDepartementRoutingModule } from './chef-departement-routing.module';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    ChefDepartementRoutingModule
  ]
})
export class ChefDepartementModule { }
