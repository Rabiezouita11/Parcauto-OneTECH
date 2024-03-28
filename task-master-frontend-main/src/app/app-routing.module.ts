import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {BoardsComponent} from "./home-page/boards/boards.component";
import {BoardComponent} from "./home-page/boards/board/board.component";
import { DetailsComponent } from './home-page/details/details.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  {path: '', redirectTo:'login',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {
    path: "home", component: HomePageComponent, children: [
      {path: "boards", component: BoardsComponent},
      {path: "board/:id", component: BoardComponent},
      {path: "details" , component : DetailsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
