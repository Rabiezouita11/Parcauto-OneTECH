import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ComponentComponent} from './admin/component/component.component';
import {NotfoundComponent} from './notfound/notfound.component';
import { AdminGuard } from './Guard/Admin/admin.guard';
import { ConducteurGuard } from './Guard/Conducteur/conducteur.guard';
import { ChefDepartementGuard } from './Guard/Chef_departement/chef-departement.guard';

const routes: Routes = [

    {
        path: 'Chef_Departement',
         canActivate: [ChefDepartementGuard], // Apply AuthGuard here
        loadChildren: () => import ('./chef-departement/chef-departement.module').then(m => m.ChefDepartementModule)
    }, 
    {
        path: 'conducteur',
         canActivate: [ConducteurGuard], // Apply AuthGuard here
        loadChildren: () => import ('./conducteur/conducteur.module').then(m => m.ConducteurModule)
    }, {
        path: 'auth',
        loadChildren: () => import ('./auth/auth.module').then(m => m.AuthModule)
    }, {
        path: '',
        component: ComponentComponent,
        canActivate: [AdminGuard], // Apply AuthGuard here

        loadChildren: () => import ('./admin/admin.module').then((m) => m.AdminModule)
    }, {
        path: '**',
        component: NotfoundComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
