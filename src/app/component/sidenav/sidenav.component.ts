import { Component, OnInit, DoCheck, Renderer2, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, DoCheck,AfterViewChecked {
  user: SocialUser
  constructor(private router: Router, private userService: UserService, private renderer: Renderer2) { }

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

}
