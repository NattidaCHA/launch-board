import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Project } from '../component/projects/data-table-projects/data-table-projects.component';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private baseUrl = 'http://192.168.99.100:8080/api/history';

  constructor(private http:HttpClient) {
   }

   getHistory(status:string = null): Observable<Project[]> {
    if(status == null)
      return this.http.get<Project[]>(`${this.baseUrl}`)
    else
      return this.http.get<Project[]>(`${this.baseUrl}?status=${status}`)
  }
}
