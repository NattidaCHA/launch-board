import { Component, OnInit } from '@angular/core';
import { SocialUser } from "angularx-social-login";
import { Router } from '@angular/router';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {

  private user: SocialUser;

  constructor(
    private router:Router,
  ) { }
  ngOnInit() 
  {
    
  }

}
