import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile/profile.component';
import {GuardAdminGuard} from '../Guard/GuardAdmin/guard-admin.guard';
import {VehiculeComponent} from './vehicule/vehicule.component';
import { UsersComponent } from './users/users.component';
import { CalenderComponent } from './calender/calender.component';
import { ReservationComponent } from './reservation/reservation.component';
import { CarburantConducteurComponent } from './carburant-conducteur/carburant-conducteur.component';

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
        path: 'vehicule',
        component: VehiculeComponent,
        canActivate: [GuardAdminGuard], // Apply AuthGuard here
        data: {
            title: 'Vehicule'
        }
    },{
        path: 'utilisateurs',
        component: UsersComponent,
        canActivate: [GuardAdminGuard], // Apply AuthGuard here
        data: {
            title: 'users'
        }
    },
    {
        path: 'calendrier',
        component: CalenderComponent,
        // canActivate: [GuardAdminGuard], // Apply AuthGuard here
        data: {
            title: 'users'
        }
    },
    {
        path: 'reservation',
        component: ReservationComponent,
        // canActivate: [GuardAdminGuard], // Apply AuthGuard here
        data: {
            title: 'users'
        }
    },
    {
        path: 'CarburantConducteur',
        component: CarburantConducteurComponent,
        // canActivate: [GuardAdminGuard], // Apply AuthGuard here
        data: {
            title: 'users'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConducteurRoutingModule {}
