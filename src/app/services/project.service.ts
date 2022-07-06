import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods' : 'GET, POST, OPTIONS, DELETE',
    'Access-Control-Allow-Headers' : 'Accept,Accept-Language,Content-Language,Content-Type'
  })
};
import { Project } from '../component/projects/data-table-projects/data-table-projects.component';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { SocialUser } from "angularx-social-login";

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  private currentUserSubject: BehaviorSubject<SocialUser>;
  public currentUser: Observable<SocialUser>;

  private baseUrl = 'http://192.168.99.100:8080/api/projects';

  url = `http://192.168.99.100:3000/`;
  // url = `http://localhost:3000/`;
  
  constructor(
    protected http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<SocialUser>(JSON.parse(localStorage.getItem('User')))
      this.currentUser = this.currentUserSubject.asObservable()
  }
  patchProjectList(_id: string, editText: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${_id}${editText}`, '');
  }

  sendpushNoti(stat = null,project = null)
  {
    if(navigator.onLine)
    {
      if(stat == null){
        this.savetolocalStore()
        this.http.post<any>(`${this.url}insertdata`,'',httpOptions).toPromise().then(()=>console.log('cd'))
      }else{
        var data = {title:`${project}`,body:'Project is done. !!'}
        this.http.post<any>(`${this.url}sendNotification`,data,httpOptions).toPromise().then(()=>console.log('patch status'))
      }
    }
  }

  postProjectList( addText: string): Observable<Project[]> {
    return this.http.post<Project[]>(`${this.baseUrl}${addText}`, '');
  }

  savetolocalStore(){
    if(navigator.onLine)
    {
      this.http.get<Project[]>(`${this.baseUrl}?sort=1`).toPromise().then((data)=>{
        var jsonFile = JSON.stringify(data)
        localStorage.setItem('mainData',jsonFile)
      })
    }
  }

  getDatalocal()
  {
    return of(JSON.parse(localStorage.getItem('mainData')))
  }

  getProjectList(sort:string = null): Observable<Project[]> {
    var url = (sort!=null?'?sort=1':'')
    if(navigator.onLine)
    {
      this.savetolocalStore();
      return this.http.get<Project[]>(`${this.baseUrl}${url}`)
    }
    else{
      return of(JSON.parse(localStorage.getItem('mainData')));
    }
  }

  getIdProjectList(_id: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/${_id}`);
  }

  deleteProjectList(_id: string): Observable<Project[]> {
    return this.http.delete<Project[]>(`${this.baseUrl}/${_id}`);
  }

  public get currentUserValue(): SocialUser {
    // console.log(this.currentUserSubject.value)
    return this.currentUserSubject.value;
  }

  login(user:SocialUser) {
    console.log(user)
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
           
    return user;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}