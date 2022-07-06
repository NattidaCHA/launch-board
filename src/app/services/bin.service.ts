import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinService {

  private baseUrlBin = 'http://192.168.99.100:8080/api/bin';
  private baseUrlRestore = 'http://192.168.99.100:8080/api/restore/';
  constructor(protected http: HttpClient) { }

  getBin(collect: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrlBin}?collect=${collect}`);
  }

  restoreBin(_id: string, collect: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrlRestore}${_id}?collect=${collect}`, '');
  }

  deletefromBin(_id: string, collect: string) {
    return this.http.delete(`${this.baseUrlBin}/${_id}?collect=${collect}`)
  }
}
