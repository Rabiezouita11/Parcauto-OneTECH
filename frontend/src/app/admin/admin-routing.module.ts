import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehiculeComponent } from './vehicule/vehicule.component';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full' , data: {title: 'Administrateur'}},
  { path: 'dashboard', component: DashboardComponent , data: {title: 'Administrateur'}},
  { path: 'vehicule', component: VehiculeComponent , data: {title: 'Administrateur'}},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
