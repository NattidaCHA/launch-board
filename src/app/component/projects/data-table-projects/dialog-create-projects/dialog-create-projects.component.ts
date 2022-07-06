import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/project.service';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { NotificationService } from 'src/app/services/notification.service';
// import { getMaxListeners } from 'cluster';
@Component({
  selector: 'app-dialog-create-projects',
  templateUrl: './dialog-create-projects.component.html',
  styleUrls: ['./dialog-create-projects.component.css']
})
export class DialogCreateProjectsComponent implements OnInit {
  _id: string;
  product_owner: string;
  projectName: string;
  launch_date: string;
  detail: string;
  launch_time:string;
  showError:any = [];

  editText: string;
  addText: string;

  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;

  states: any[] = [];
  readonly VAPID_PUBLIC_KEY = "BBBVwkbvAKSu6tXBnBOco2qjiY5nm222XxwVQnoWNNaIBMdSHtFHWTSUbjEIVxfR9zpBY-Lrl7cTp5lu5jIrSPs"

  constructor(
    private matDialog: MatDialog,
    private projectService: ProjectService,
    private userService:UserService,
    private swPush:SwPush,
    private swUpdate:SwUpdate,
    private notification:NotificationService ) {

      this.stateCtrl = new FormControl();

      this.userService.getUserList().toPromise().then((data)=>{
        for(let item in data['data'])
        {
          this.states.push({name:data['data'][item]['email']})
        }
      }).then(()=>{
        this.filteredStates = this.stateCtrl.valueChanges
        .pipe(
          startWith(''),
          map(state => state ? this.filterStates(state) : this.states.slice())
        );
      })
    }

    filterStates(name: string) {
      return this.states.filter(state =>
        state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

  ngOnInit() {  

  }

  add() {
    this.checkInputValue().then(()=>{
      this.addText = `?project=${this.projectName}&email=${this.product_owner}&launch_date=${this.launch_date}&launch_time=${this.launch_time}&detail=${this.detail}`;
      this.projectService.postProjectList(this.addText).subscribe((data) => {
        if('error' in data)
        {
          this.showError['project'] = (!data['error']['project']?"":data['error']['project'])
          this.showError['launch_date'] = (!data['error']['launch_date']?"":data['error']['launch_date'])
          this.showError['launch_time'] = (!data['error']['launch_time']?"":data['error']['launch_time'])
          this.showError['detail'] = (!data['error']['detail']?"":data['error']['detail'])
          this.showError['email'] = (!data['error']['email']?"":data['error']['email'])
        }
        else{
          this.projectService.sendpushNoti()
          this.close()
        }
      });
    })
  }

  checkInputValue():Promise<any>
  {
    return new Promise(resolve => {
      this.projectName = (!this.projectName?"":this.projectName)
      this.launch_date = (!this.launch_date?"":this.launch_date)
      this.launch_time = (!this.launch_time?"":this.launch_time)
      resolve()
    });
  }

  close(){
    this.matDialog.closeAll();
  }
}
