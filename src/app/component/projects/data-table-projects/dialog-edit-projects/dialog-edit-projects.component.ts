import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/project.service';
import { formatDate } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-edit-projects',
  templateUrl: './dialog-edit-projects.component.html',
  styleUrls: ['./dialog-edit-projects.component.css']
})
export class DialogEditProjectsComponent implements OnInit {
  _id: string;
  product_ownerGetStorage: string;
  project_nameGetStorage: string;
  launchGetStorage: string;
  launchdateGetStorage: string;
  detailGetStorage: string;
  launch_timeGetStorage: string;
  editText: string;
  check: string;
  status: any;
  stat;

  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;
  states: any[] = [];
  showError: any = [];

  product_owner: string;
  project_name: string;
  launchdate: string;
  launch_time: string;
  detail: string;
  launch: string;
  update: string;
  update_color: string;
  constructor(
    private matDialog: MatDialog,
    private projectService: ProjectService,
    private userService: UserService) {
    this.stateCtrl = new FormControl();

    this.userService.getUserList().toPromise().then((data) => {
      for (let item in data['data']) {
        this.states.push({ name: data['data'][item]['email'] })
      }
    }).then(() => {
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
    if (localStorage.getItem('_id') != null) {
      this._id = localStorage.getItem('_id');
      this.product_owner = localStorage.getItem('product_owner.email');
      this.project_name = localStorage.getItem('project');
      this.launch = localStorage.getItem('launch_date');
      this.detail = localStorage.getItem('detail');
      this.product_ownerGetStorage = localStorage.getItem('product_owner.email');
      this.project_nameGetStorage = localStorage.getItem('project');
      this.launchGetStorage = localStorage.getItem('launch_date');
      this.detailGetStorage = localStorage.getItem('detail');
      this.launchdate = formatDate(new Date(this.launch).toLocaleDateString('en-US'), 'yyyy-MM-dd', 'en-US');
      this.launch_time = formatDate(new Date(this.launch), 'HH:mm', 'en-US');
      this.launchdateGetStorage = formatDate(new Date(this.launch).toLocaleDateString('en-US'), 'yyyy-MM-dd', 'en-US');
      this.launch_timeGetStorage = formatDate(new Date(this.launch), 'HH:mm', 'en-US');
      this.check = localStorage.getItem('status');
    }
  }

  close() {
    this.matDialog.closeAll()
  }

  save() {
    this.stat = (this.status == null || this.status == false) ? this.stat = '1' : this.stat = '0';
    this.projectService.getProjectList().toPromise().then((data: any) => {
      if (this.project_name == this.project_nameGetStorage && this.product_owner == this.product_ownerGetStorage &&
        this.launchdate == this.launchdateGetStorage && this.launch_time == this.launch_timeGetStorage &&
        this.detail == this.detailGetStorage) {
        this.editText = `?project=${this.project_name}&email=${this.product_owner}&launch_date=${this.launchdate}
            &launch_time=${this.launch_time}&detail=${this.detail}&update=${this.update}&status=${this.stat}`;
        this.projectService.patchProjectList(this._id, this.editText).subscribe((data) => {
          this.projectService.sendpushNoti((this.stat == '0')?'true':null,(this.stat == '0')?`${this.project_name}`:null)
          this.close();
        });
      }
      else {
        for (let i = 0; i < data.data.length; i++) {
          if (this._id == data.data[i]._id) {
            if (this.launchdate == this.launchdateGetStorage && this.launch_time == this.launch_timeGetStorage) {
              if (data.data[i].update != 'null') {
                this.update = data.data[i].update;
                this.update_color = this.update
              }
              else {
                this.update = data.data[i].created_at;
                this.update_color = data.data[i].created_at;
              }
            }
            else {
              var date = new Date().getTime() + 2000;
              this.update = formatDate(new Date(parseInt(date.toString())), 'yyyy-MM-dd HH:mm:ss', 'en-US');
              this.update_color = formatDate(new Date(parseInt(date.toString())), 'yyyy-MM-dd HH:mm:ss', 'en-US');
            }
            this.showError['project'] = (this.project_name == '') ?
              'The project field is required.' : this.showError['project'] = '';

            this.showError['email'] = (this.product_owner == '') ?
              'The email must be a valid email address.,The email format is invalid.' : this.showError['email'] = '';

            this.showError['launch_date'] = (this.launchdate == '') ?
              'The launch date field is required.' : this.showError['launch_date'] = '';

            this.showError['launch_time'] = (this.launch_time == '') ?
              'The launch time field is required.' : this.showError['launch_time'] = '';

            this.showError['detail'] = (this.detail == '' || this.detail.length < 10) ?
              'The detail must be at least 10 characters.' : this.showError['detail'] = '';

            this.editText = `?project=${this.project_name}&email=${this.product_owner}&launch_date=${this.launchdate}
            &launch_time=${this.launch_time}&detail=${this.detail}&update=${this.update}&update_color=${this.update_color}&status=${this.stat}`;
      
            (this.project_name == '' || this.product_owner == '' || this.launchdate == '' || this.launch_time == '' ||
              this.detail == '' || this.detail.length < 10) ? this.stat = '1' : this.projectService.patchProjectList(this._id, this.editText).subscribe((data) => {
                this.projectService.sendpushNoti()
                if(localStorage.getItem('UserChanged') == 'true'){
                  return false;
                } else{
                  localStorage.setItem('UserChanged','true')
                }
                this.close();
              });
          }
        }
      }
    });
  }
}