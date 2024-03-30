import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidbarComponent } from './sidbar/sidbar.component';
import { ComponentComponent } from './component/component.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    SidbarComponent,
    ComponentComponent,
    DashboardComponent
  ],
 
  exports: [HeaderComponent, FooterComponent],
  imports: [CommonModule, AdminRoutingModule, ReactiveFormsModule, FormsModule],

})
export class AdminModule { }
