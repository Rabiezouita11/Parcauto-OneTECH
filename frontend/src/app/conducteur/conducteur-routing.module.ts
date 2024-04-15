import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile/profile.component';
import {GuardAdminGuard} from '../Guard/GuardAdmin/guard-admin.guard';
import {VehiculeComponent} from './vehicule/vehicule.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard', // Redirect to dashboard by default
        pathMatch: 'full'
    }, {
        path: 'dashboard',
        component: HomeComponent,
        data: {
            title: 'dashboard'
        }
    }, {
        path: 'profile',
        component: ProfileComponent,
        data: {
            title: 'profile'
        }
    }, {
        path: 'Vehicule',
        component: VehiculeComponent,
        canActivate: [GuardAdminGuard], // Apply AuthGuard here
        data: {
            title: 'Vehicule'
        }
    },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConducteurRoutingModule {}
