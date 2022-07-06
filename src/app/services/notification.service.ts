import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  public project:any
  public checking:boolean = false

  readonly VAPID_PUBLIC_KEY = "BBBVwkbvAKSu6tXBnBOco2qjiY5nm222XxwVQnoWNNaIBMdSHtFHWTSUbjEIVxfR9zpBY-Lrl7cTp5lu5jIrSPs"

  public subURL = `http://192.168.99.100:3000/subscription`
  // public subURL = `http://localhost:3000/subscription`

  constructor(
    private swPush: SwPush,
    private http: HttpClient) { }

  getVapID() {
    return this.VAPID_PUBLIC_KEY
  }

  postSubscription(sub: PushSubscription, title: string, body: string) {
    let data = { sub: sub, title: title, body: body }
    return this.http.post(this.subURL, data)
  }

  patchData(project)
  {
    this.project = project
    this.checking = true
  }
}