import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Department } from '../component/departments/data-table-dpm/data-table-dpm.component';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  push(value: any): any {
    throw new Error("Method not implemented.");
  }

  private baseUrl = 'http://192.168.99.100:8080/api/departments';

  constructor(private http:HttpClient) { }
  getDepartmentList(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}?sort=0`);
  }

  postDepartmentList(addText: string): Observable<Department[]> {
    return this.http.post<Department[]>(`${this.baseUrl}${addText}`, '');
  }

  patchDepartmentList(_id: string, editText: string): Observable<Department[]> {
    return this.http.patch<Department[]>(`${this.baseUrl}/${_id}${editText}`, '');
  }

  deleteDepartmentList(_id: string): Observable<Department[]> {
    return this.http.delete<Department[]>(`${this.baseUrl}/${_id}`);
  }
}
