import { Component, OnInit } from '@angular/core';
import { SocialUser, AuthService } from 'angularx-social-login';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private authService:AuthService) { }


  ngOnInit() {

  }

}
