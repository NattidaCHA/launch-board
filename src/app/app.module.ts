import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, MatSortModule, MatDialogModule, MatAutocompleteModule, MatButtonModule, MatButtonToggleModule,
  MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatExpansionModule, MatGridListModule, MatInputModule,
  MatListModule, MatMenuModule, MatNativeDateModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule,
  MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatTableModule, MatTabsModule,
  MatToolbarModule, MatTooltipModule, MatIconModule, MatFormFieldModule, MatStepperModule, } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
///////////////------- component -------//////////////
import { AppComponent } from './app.component'
import { LoginComponent } from './component/home/login/login.component'
import { DataTableComponent } from './component/users/data-table/data-table.component'
import { DialogEditComponent } from './component/users/data-table/dialog-edit/dialog-edit.component'
import { HomeComponent } from './component/home/home.component'
import { DepartmentsComponent } from './component/departments/departments.component'
import { UsersComponent } from './component/users/users.component'
import { DataTableDPMComponent } from './component/departments/data-table-dpm/data-table-dpm.component';

import { DataTableProjectsComponent} from './component/projects/data-table-projects/data-table-projects.component'
import { ProjectsComponent } from './component/projects/projects.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { SidenavComponent } from './component/sidenav/sidenav.component';
import { BinComponent } from './component/bin/bin.component';
///////////////------- service -------//////////////
import { LoginService } from '../app/services/login.service'
import { UserService } from './services/user.service'
import { DepartmentService } from './services/department.service'
import { SocialLoginModule, AuthServiceConfig, LoginOpt } from "angularx-social-login";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleLoginProvider} from "angularx-social-login"; 
import { DialogEditDPMComponent } from './component/departments/data-table-dpm/dialog-edit-dpm/dialog-edit-dpm.component';
import { CookieService } from 'ngx-cookie-service';
import { DialogEditProjectsComponent } from './component/projects/data-table-projects/dialog-edit-projects/dialog-edit-projects.component';
import { DialogCreateProjectsComponent } from './component/projects/data-table-projects/dialog-create-projects/dialog-create-projects.component';
import { CreatedepartmentComponent } from './component/departments/data-table-dpm/createdepartment/createdepartment.component';
import { MainComponent } from './component/main/main.component';
import { HistoryComponent } from './component/history/history.component';
import { DialogShowProjectsComponent } from './component/projects/data-table-projects/dialog-show-projects/dialog-show-projects.component';
import { DialogShowComponent } from './component/users/data-table/dialog-show/dialog-show.component';
import { DialogViewHistoryComponent } from './component/history/dialog-view-history/dialog-view-history.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LayoutModule } from '@angular/cdk/layout';
import { NavSideComponent } from './component/nav-side/nav-side.component';

const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
};

let GoogleProviderId = "249825874292-s9komqi5t6k8spch0kjdpdb0325p3osp.apps.googleusercontent.com";

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(GoogleProviderId,googleLoginOptions)
  },
]);

export function provideConfig() {
  return config;
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DepartmentsComponent,
    LoginComponent,
    UsersComponent,    
    DataTableComponent,
    DialogEditComponent,
    DataTableDPMComponent,
    DialogEditDPMComponent,
    ProjectsComponent,
    DataTableProjectsComponent,
    DialogEditProjectsComponent,
    DialogCreateProjectsComponent,
    CreatedepartmentComponent,
    NavbarComponent,
    SidenavComponent,
    MainComponent,
    BinComponent,
    HistoryComponent,
    DialogShowProjectsComponent,
    DialogShowComponent,
    DialogViewHistoryComponent,
    NavSideComponent,
 
   
   

  ],
  imports: [
    CommonModule, 
    MatButtonModule,
    BrowserModule,
    MatInputModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    FormsModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatListModule,
 
    SocialLoginModule,
    AppRoutingModule,
    HttpClientModule,
    MatAutocompleteModule,
    AppRoutingModule,
    FormsModule,
   
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    InfiniteScrollModule,
    LayoutModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],

  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule, 
    MatSidenavModule, 
    MatListModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  providers: 
  [ 
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig,
      
    },
    LoginService, 
    UserService,
    CookieService,
    DepartmentService,
    MatDatepickerModule, 
  ],
  bootstrap: [AppComponent],
  entryComponents:[DialogEditComponent,DialogShowComponent,DialogEditDPMComponent,CreatedepartmentComponent,DialogEditProjectsComponent,DialogCreateProjectsComponent,DialogShowProjectsComponent,DialogViewHistoryComponent],

})
export class AppModule { }
