import { Component, OnInit, DoCheck, Renderer2, AfterViewChecked, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SocialUser } from 'angularx-social-login';
import { LoginService } from 'src/app/services/login.service';
import { MainComponent } from '../main/main.component';
import { HomeComponent } from '../home/home.component';
import { UsersComponent } from '../users/users.component';
import { DepartmentsComponent } from '../departments/departments.component';
import { ProjectsComponent } from '../projects/projects.component';


@Component({
  selector: 'app-nav-side',
  templateUrl: './nav-side.component.html',
  styleUrls: ['./nav-side.component.css']
})
export class NavSideComponent implements OnInit, DoCheck,AfterViewChecked {
  user: SocialUser
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,private router: Router, private userService: UserService,
     private renderer: Renderer2 ,private loginService:LoginService
     ) {}
  
     

     ngOnInit() {
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
  
    ngAfterViewChecked(): void {
      if(this.router.url == '/projects') {
        var btn = document.getElementById('projects')
       }
      else if(this.router.url == '/users') {
        var btn = document.getElementById('users')
      } 
      else if(this.router.url == '/departments') {
        var btn = document.getElementById('departments')
      }
      else if(this.router.url == '/history') {
        var btn = document.getElementById('history')
      }
      else{
        var btn = document.getElementById('bin')
      }
      if(btn != null)
        {
          var btns = document.getElementById("btnSidebar").querySelectorAll(".btn");
          for (let i = 0; i < btns.length; i++) {
            if (btns[i].id == btn.id) {
              this.renderer.setStyle(btn, 'background-color', 'gray')
            }
            else {
              this.renderer.setStyle(btns[i], 'background-color', 'black')
            }
          }
        }
    }
  
    navigate(route: string) {
      var btn = document.getElementById(route)
      var btns = document.getElementById("btnSidebar").querySelectorAll(".btn");
      for (let i = 0; i < btns.length; i++) {
        if (btns[i].id == btn.id) {
          this.renderer.setStyle(btn, 'background-color', 'gray')
        }
        else {
          this.renderer.setStyle(btns[i], 'background-color', 'black')
        }
      }
      this.router.navigateByUrl(route)
    }
  
    signOut(): void {
      this.user = null
      this.loginService.signOut();
    }
  }