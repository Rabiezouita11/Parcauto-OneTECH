import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotfoundComponent } from './notfound/notfound.component';

import { AuthComponentComponent } from './auth/authComponent/auth-component/auth-component.component';
import { ConducteurComponentComponent } from './conducteur/Component/conducteur-component/conducteur-component.component';
import { GuardGuard } from './Guard/guard.guard';

const routes: Routes = [


    {
        path: '',
        component: ConducteurComponentComponent,
        canActivate: [GuardGuard], // Apply AuthGuard here
        loadChildren: () => import('./conducteur/conducteur.module').then(m => m.ConducteurModule)
    }, {
        path: 'auth',
        component: AuthComponentComponent,

        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    }, {
        path: '**',
        component: NotfoundComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
