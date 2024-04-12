import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [

  { path: 'dashboard', component: HomeComponent, data: { title: 'dashboard' } },
  { path: 'profile', component: ProfileComponent, data: { title: 'profile' } },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConducteurRoutingModule { }
