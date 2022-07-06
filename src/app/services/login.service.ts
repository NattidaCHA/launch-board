import { Injectable } from '@angular/core';
import { AuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from "angularx-social-login";
import { Observable, Subject, from, BehaviorSubject, of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Register } from '../component/home/login/login'
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';
import { User } from '../Model/User';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements CanActivate {

  Userlist : any
  dialog: {}
  auto: Observable<boolean>

  error:Observable<any>
  errorSubject = new Subject<any>()

  public user = new SocialUser;

  public datas: Register[]

  private autologgIn = new Subject<boolean>();

  signInsubscribe = new Subscription

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private userService: UserService) {
    this.auto = this.autologgIn.asObservable()
    this.error = this.errorSubject.asObservable()
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
      if (this.validEmail(user.email) == true) {
        this.http.get<Register>(`http://192.168.99.100:8080/api/users?email=${user.email}`).subscribe(
          data => {
            this.datas = Object.values(data)
            if (this.datas.length < 1) {
              this.autologgIn.next(false)
            } else {
              this.userService.login(user)
              this.autologgIn.next(true)
              this.router.navigateByUrl('projects')
            }
          }
        )
      }
      else {
        this.signOut()
        this.autologgIn.next(true)
        alert('Email is not correct !!')
        this.router.navigateByUrl('login')
      }
    })
  }

  public signOut(): void {
    this.authService.signOut()
    this.signInsubscribe.unsubscribe()
    this.userService.logout()
    this.router.navigateByUrl('login')
  }

  public LoggedInRegister(data: Register) {
    this.http.post<Register>('http://192.168.99.100:8080/api/users', data).toPromise().then((data) => {
      if ('error' in data) {
        this.errorSubject.next(data)
      }
      else {
        this.errorSubject.next(['success'])
      }
    })
  }

  public validEmail(str) {
    var mailPattern = [/^[a-zA-Z0-9._-]+@gmail.com$/, /^[a-zA-Z0-9._-]+@dpu.ac.th$/]
    for (let i = 0; i < mailPattern.length; i++) {
      if (mailPattern[i].test(str)) {
        return mailPattern[i].test(str)
      }
    }
  }

  async canActivate() {
    if (this.userService.currentUserValue) {
      await this.http.get<any>('http://192.168.99.100:8080/api/users').toPromise().then(data=>{
      this.Userlist = data.data
    })
      return true
    }
    else {
      this.signOut()
      return false
    }
  }

  async checkUser(){
    var isUser
    await this.Userlist.forEach(user => {
      if(user.email == this.userService.currentUserValue.email)
      {
        isUser = true;
        return true
      }
    });
    if(isUser != true)
    {
      this.signOut()
      return false
    }
  }

}
