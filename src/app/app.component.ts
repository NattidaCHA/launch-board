import { Component, DoCheck, OnInit, OnDestroy } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { NotificationService } from './services/notification.service';
import { ProjectService } from './services/project.service';
import { Observable, interval, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,DoCheck,OnDestroy {
  title = 'launch-board-api';
  sub : Subscription

  constructor(
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private notification: NotificationService,
    private projectService:ProjectService,
    private http: HttpClient) {
    if (swUpdate.isEnabled && !localStorage.getItem('subPush')) {
      this.swPush.requestSubscription({
        serverPublicKey: this.notification.getVapID()
      })
        .then(sub => {
          this.notification.postSubscription(sub, "Subscribe", "thank you for your subscribe").subscribe()
          localStorage.setItem('subPush', 'true');
        })
        .catch(err => console.error("Could not subscribe to notifications", err));
    }
    this.sub = interval(5000)
    .subscribe(() => {
      this.projectService.savetolocalStore()
    });
  }

  ngOnInit(): void {
    this.reloadCache()
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  ngDoCheck(): void {
    // if(this.notification.checking == true && localStorage.getItem('subPush') == 'true')
    // {
    //   this.swPush.requestSubscription({
    //     serverPublicKey: this.notification.getVapID()
    //   })
    //   .then(sub => {
    //     this.notification.postSubscription(sub, `${this.notification.project}`, "The project is time out. !!").subscribe()
    //   })
    //   .catch(err => console.error("Could not subscribe to notifications", err));
    // }
    // this.notification.checking = false
  }

  reloadCache(){
    if(this.swUpdate.isEnabled){
      this.swUpdate.available.subscribe(()=>{
        if(confirm('New version available! would you like to update?')){
          window.location.reload()
        }
      })
    }
  }

}