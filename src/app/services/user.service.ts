import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/Model/User'
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { AuthService, SocialUser } from "angularx-social-login";

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private baseUrl = 'http://192.168.99.100:8080/api/users';
  currentUser:Observable<SocialUser>
  currentUserSubject:BehaviorSubject<SocialUser>

  constructor(
    protected http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<SocialUser>(JSON.parse(localStorage.getItem('User')))
      this.currentUser = this.currentUserSubject.asObservable()
  }

  getUserList(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  patchUserList(_id: string, editText: string): Observable<User[]> {
    return this.http.patch<User[]>(`${this.baseUrl}/${_id}${editText}`, '');
  }

  deleteUserList(_id: string): Observable<User[]> {
    return this.http.delete<User[]>(`${this.baseUrl}/${_id}`);
  }

  loadUser() {
    const lsUser = JSON.parse(localStorage.getItem('User'))
    return this.http.get<User>(`${this.baseUrl}?email=${lsUser.email}`).toPromise().then((data) => {
      return data
    })
  }

  get currentUserValue():SocialUser
  {
    return this.currentUserSubject.value
  }

  login(user: SocialUser) {
    this.currentUserSubject.next(user)
    localStorage.setItem('User',JSON.stringify(user))
  }

  logout() {
    this.currentUserSubject.next(null)
    localStorage.removeItem('User')
  }
}
