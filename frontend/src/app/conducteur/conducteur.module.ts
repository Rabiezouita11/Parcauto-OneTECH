import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConducteurRoutingModule } from './conducteur-routing.module';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ConducteurComponentComponent } from './Component/conducteur-component/conducteur-component.component';
import { HeaderComponent } from './Component/header/header.component';
import { FooterComponent } from './Component/footer/footer.component';


@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    ConducteurComponentComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    ConducteurRoutingModule,

  ]
})
export class ConducteurModule { }
