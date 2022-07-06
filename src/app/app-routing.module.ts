import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { UsersComponent } from './component/users/users.component';
import { DepartmentsComponent } from './component/departments/departments.component';
import { LoginService } from './services/login.service'
import { ProjectsComponent } from './component/projects/projects.component';
import { MainComponent } from './component/main/main.component';
import { BinComponent } from './component/bin/bin.component';
import { HistoryComponent } from './component/history/history.component'

const routes: Routes = [
  { path: 'login',component:HomeComponent},
  { path: '', component: MainComponent},
  { path: 'users',component:UsersComponent,canActivate:[LoginService]},
  { path: 'departments',component:DepartmentsComponent,canActivate:[LoginService]},
  { path: 'projects',component:ProjectsComponent,canActivate:[LoginService]},
  { path: 'history',component:HistoryComponent,canActivate:[LoginService]},
  { path: 'bin',component:BinComponent,canActivate:[LoginService]}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
