import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocialUser, AuthService } from "angularx-social-login";
import { HttpClient } from '@angular/common/http';
import { Register } from '../login/login'
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/Model/User'

///////////////------- service -------//////////////
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service'
import { DepartmentService } from 'src/app/services/department.service';
import { Department } from '../../departments/data-table-dpm/data-table-dpm.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  item:string;
  item2:string;
  item3:string;
  public user: SocialUser
  public _user: User

  public regist: Register
  public reg: Register[]

  public auto: boolean = true

  regis:any[];
  returnUrl: string

  registerForm: FormGroup

  funcSubscribe: Subscription

  submitted = false;

  public showError:any =[]

  departments: Department[] | any = [];


  firstname :string;
  lastname:string;
  department:string;
  errorSubscribe :Subscription;

  constructor(
    private service: LoginService,
    private userServices: UserService,
    private router: Router,
    private authService: AuthService,
    private departmentService: DepartmentService,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (this.userServices.currentUserValue) {
      this.router.navigateByUrl('projects')
    }
    else {
      this.funcSubscribe = this.authService.authState.subscribe((user) => { this.user = user })
    }

    this.service.auto.subscribe(bool => {
      this.auto = bool
    })

    this.registerForm = new FormGroup({
      firstname: new FormControl(),
      lastname: new FormControl(),
      department: new FormControl()
    })

    this.departmentService.getDepartmentList().subscribe((data: any) => {
      for (let i = 0; i < data.data.length; i++) {
        this.departments[i] = data.data[i].department;
      }
    });
  }


  public signInWithGoogle(): void {
    this.service.signInWithGoogle()
  }

  onSubmit() {
    if(this.errorSubscribe)
    {
      this.errorSubscribe.unsubscribe();
    }
    this.submitted = true;
    this.regist = this.registerForm.value
    this.regist.email = this.user.email
    this.service.LoggedInRegister(this.regist)
    this.errorSubscribe = this.service.error.subscribe(error=>{
      if('error' in error)
      {
          this.showError['firstname'] = (!error['error']['firstname']?"":error['error']['firstname'])
          this.showError['lastname'] = (!error['error']['lastname']?"":error['error']['lastname'])
          this.showError['department'] = (!error['error']['department']?"":error['error']['department'])
      }


      else{
        this.userService.login(this.user)
        this.router.navigateByUrl('projects')
      }
    })
  }
}
