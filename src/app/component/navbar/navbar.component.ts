import { Component, OnInit, DoCheck } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { UserService } from 'src/app/services/user.service';
import { LoginService } from 'src/app/services/login.service';
import { Routes, Router } from '@angular/router';
import { MainComponent } from '../main/main.component';
import { HomeComponent } from '../home/home.component';
import { UsersComponent } from '../users/users.component';
import { DepartmentsComponent } from '../departments/departments.component';
import { ProjectsComponent } from '../projects/projects.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit,DoCheck {
  
  public user : SocialUser

  constructor(private userService:UserService,private loginService:LoginService, private router: Router) {
    
  }

  ngDoCheck(): void {
    if (this.userService.currentUserValue && this.router.url != '/') {
      this.user = this.userService.currentUserValue
    }
    else if(this.router.url == '/' || this.router.url == '/login')
    {
      this.user = null
    }
  }

  ngOnInit() {
    
  }

  signOut(): void {
    this.user = null
    this.loginService.signOut();
  }

}
