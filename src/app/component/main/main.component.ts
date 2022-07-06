import { Component, OnInit, Renderer2, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { formatDate } from '@angular/common';
import { switchMap, startWith, map } from 'rxjs/operators';
import { interval, Observable, Subscription, empty } from 'rxjs';
import swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DepartmentService } from '../../services/department.service';
import { NotificationService } from '../../services/notification.service';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit,OnDestroy {

  spincolor = 'primary';
  mode = 'indeterminate';
  value = 50;
  projects: Project[] | any = [];
  sec: any;
  min: any;
  hour: any;
  day: any;
  remTime: any;
  count: number;
  countScroll: number = 5;
  countScrollDefault: number;
  sorting: any;
  timeStamp: any;
  detail: string;
  remTimeArr: string[] | any = [];
  timeStampArr: string[] | any = [];
  list: string[] | any = [];
  listImages: string[] | any = [];
  states: any[]
  departmentstates: any[]
  statusStates: any[] = [
    { name: "red" },
    { name: "yellow" },
    { name: "green" }
  ];
  stat: any[] = [];
  allUsers: any[] = [];
  allDepartment: any[] = [];
  sort: string = '1';
  checkList: boolean;
  update: any;
  btnStatus: any;
  stateCtrl: FormControl;
  departmentCtrl: FormControl;
  StatusCtrl: FormControl;
  filteredStates: Observable<any[]>;
  filtereddepartment: Observable<any[]>;
  filteredStatus: Observable<any[]>;
  fil: boolean
  loading:boolean
  createSubscribe: Subscription
  sub:Subscription
  checkBool: boolean = false;
  color: string;
  product_owner: string;
  Department: string;
  noData :any
  noProjects:boolean

  constructor(
    private projectService: ProjectService,
    private renderer: Renderer2,
    private userService: UserService,
    private departmentService: DepartmentService,
    private notification: NotificationService) {
    this.stateCtrl = new FormControl();
    this.departmentCtrl = new FormControl();
    this.StatusCtrl = new FormControl();
    this.countScrollDefault = this.countScroll;

    this.userService.getUserList().toPromise().then((data) => {
      for (let item in data['data']) {
        this.allUsers.push({ name: data['data'][item]['email'] })
      }
      this.states = this.allUsers
    }).then(() => {
      this.filteredStates = this.stateCtrl.valueChanges
        .pipe(
          startWith(''),
          map(state => state ? this.filterStates('email', state) : this.states.slice())
        );
    })
    this.departmentService.getDepartmentList().toPromise().then((data) => {
      for (let item in data['data']) {
        this.allDepartment.push(data['data'][item]['department'])
      }
    })

  }

  ngOnInit() {
    this.setFilter();
    this.loading = false;
    this.noData = document.getElementById('noData')
    this.sub = interval(5000)
    .subscribe(() => {
      if(localStorage.getItem('UserChanged') == 'true')
      {
        (this.stat.length == 1) ? this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString()) :
        (this.stat.length) == 2 ? this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString(), Object.keys(this.stat[1]).toString(), Object.values(this.stat[1]).toString()) :
        this.createList()
        localStorage.removeItem('UserChanged')
      }
      this.projectService.getDatalocal().toPromise().then(data=>{
        if(data.count > this.projects.length ||data.count < this.projects.length)
        {
          (this.stat.length == 1) ? this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString()) :
          (this.stat.length) == 2 ? this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString(), Object.keys(this.stat[1]).toString(), Object.values(this.stat[1]).toString()) :
          this.createList()
        }
      })
    });
  }

  getAlluser() {
    return new Promise((resolve) => {
      this.states = this.allUsers
      resolve()
    })
  }

  ngDoCheck(): void {
    if (this.departmentCtrl.value && this.fil == true) {
      for (let item in this.allDepartment) {
        this.states = []
        if (this.departmentCtrl.value == this.allDepartment[item]) {
          this.userService.getUserList().toPromise().then((data) => {
            for (let item in data['data']) {
              if (data['data'][item]['department'] == this.departmentCtrl.value) {
                this.states.push({ name: data['data'][item]['email'] })
              }
            }
          }).then(() => {
            this.filteredStates = this.stateCtrl.valueChanges
              .pipe(
                startWith(''),
                map(state => state ? this.filterStates('email', state) : this.states.slice())
              );
          })
          this.fil = false
        }
      }
    }
  }

  setFilter() {
    this.product_owner = ''
    this.Department = ''
    this.states = [];
    this.departmentstates = [];
    this.stat = []
    this.btnColor(null);

    this.departmentService.getDepartmentList().toPromise().then((data) => {
      for (let item in data['data']) {
        this.departmentstates.push({ name: data['data'][item]['department'] })
      }
    }).then(() => {
      this.filtereddepartment = this.departmentCtrl.valueChanges
        .pipe(
          startWith(''),
          map(department => department ? this.filterStates('department', department) : this.departmentstates.slice())
        );
    })

    this.states = this.allUsers
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this.filterStates('email', state) : this.allUsers.slice())
      );

    this.createList();
  }

  filterStates(stat: string, name: string) {
    let filStates
    if (stat == 'email') {
      filStates = this.states
      this.fil = true
    }
    else {
      filStates = this.departmentstates
      this.fil = true
    }
    filStates.filter(state => {
      if (state.name.toLowerCase().indexOf(name.toLowerCase()) === 0 == true) {
        if (this.stat.length < 1) {
          (stat == 'email') ? this.stat.push({ email: name }) : this.stat.push({ department: name });
          this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString())
        }
        else if (this.stat.length > 0 && this.stat.length <= 3) {
          asyncForEach(stat, this.stat, async (num, i) => {
            if (num != null) {
              this.stat[i] = (stat == 'email') ? { email: name } : { department: name };
              (this.stat.length == 1) ? this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString()) :
                (this.stat.length) == 2 ? this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString(), Object.keys(this.stat[1]).toString(), Object.values(this.stat[1]).toString()) :
                  this.createList()
            }
            else if (num == null) {
              (stat == 'email') ? this.stat.push({ email: name }) : this.stat.push({ department: name });
              (this.stat.length == 1) ? this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString()) :
                (this.stat.length) == 2 ? this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString(), Object.keys(this.stat[1]).toString(), Object.values(this.stat[1]).toString()) :
                  this.createList()
            }
          })
        }
      }
    });
    return filStates.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0)
  }

  ngAfterViewChecked() {
    this.setColorList();
  }

  checkCreate(filter1: string = null, filValue1: string = null, filter2: string = null, filValue2: string = null) {
    if (filter1 == "department" || filter2 == "department") {
      for (let item in this.allDepartment) {
        if (filValue1 == this.allDepartment[item] || filValue2 == this.allDepartment[item]) {
          (this.stat.length == 1) ? this.createList(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString()) :
          (this.stat.length) == 2 ? this.createList(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString(), Object.keys(this.stat[1]).toString(), Object.values(this.stat[1]).toString()) :
          this.createList()
        }
      }
    }
    if (filter1 == "email" || filter2 == "email") {
      for (let item in this.allUsers) {
        if (filValue1 == this.allUsers[item].name || filValue2 == this.allUsers[item].name) {
          (this.stat.length == 1) ? this.createList(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString()) :
            (this.stat.length) == 2 ? this.createList(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString(), Object.keys(this.stat[1]).toString(), Object.values(this.stat[1]).toString()) :
              this.createList()
        }
      }
    }
  }

  createList(filter1: string = null, filValue1: string = null, filter2: string = null, filValue2: string = null) {
    if (this.createSubscribe) {
      this.createSubscribe.unsubscribe()
    }
    this.createSubscribe = this.projectService.getProjectList(this.sort).pipe(switchMap((data: any) => {
      (data.data.length == 0) ? this.checkList = false : this.checkList = true;
      this.count = data.data.length;
      this.projects = data.data;
      for (let i = 0; i < this.count; i++) {
        if (this.stat.length <= 1 ? this.projects[i].product_owner[filter1] == filValue1 : (this.stat.length == 2) ? this.projects[i].product_owner[filter1] == filValue1 && this.projects[i].product_owner[filter2] == filValue2 : this.projects[i].status == '1') {
          if (this.projects[i].status == '1') {
            var pj_date = formatDate(new Date(parseInt(this.projects[i].launch_date.$date.$numberLong)), 'd MMM yyyy HH:mm', 'en-US');
            this.update = (this.projects[i].update == 'null') ? this.projects[i].update_color : this.projects[i].update;
            var updateDate = new Date(this.update);
            let now = new Date();
            let launchDate = new Date(pj_date);
            this.remTime = launchDate.getTime() - now.getTime();
            this.timeStamp = launchDate.getTime() - updateDate.getTime();
            this.remTimeArr[i] = launchDate.getTime() - now.getTime();
            this.timeStampArr[i] = launchDate.getTime() - updateDate.getTime();
            this.sec = Math.floor(this.remTime / 1000);
            this.min = Math.floor(this.sec / 60);
            this.hour = Math.floor(this.min / 60);
            this.day = Math.floor(this.hour / 24);

            this.hour %= 24;
            this.min %= 60;
            this.sec %= 60;

            this.hour = (this.hour < 10) ? '0' + this.hour : this.hour;
            this.min = (this.min < 10) ? '0' + this.min : this.min;
            this.sec = (this.sec < 10) ? '0' + this.sec : this.sec;

            this.day = (this.day <= '0') ? '0' : this.day;
            this.hour = (this.hour <= '00') ? '00' : this.hour;
            this.min = (this.min <= '00') ? '00' : this.min;
            this.sec = (this.sec <= '00') ? '00' : this.sec;

            this.projects.push(createCountDown((i + 1).toString(), this.projects[i]._id, this.projects[i].project,
              this.projects[i].product_owner, this.projects[i].status, pj_date, this.projects[i].launch_date.$date.$numberLong,
              this.day, this.hour, this.min, this.sec, this.projects[i].detail, this.projects[i].updated_at,
              this.projects[i].update_color, this.projects[i].update, this.projects[i].sticky));
            this.loading = true;
          }
        }
      }
      if(this.projects.length == 0)
      {
        this.loading = true;
        this.noProjects = true;
        this.renderer.setStyle(this.noData, 'display', '')
      }
      else
      {
        this.noProjects = false;
        this.renderer.setStyle(this.noData, 'display', 'none')
      }
      this.projects.splice(0, this.count);
      return interval(500)
    })).subscribe(_ => {
      for (let i = 0; i < this.count; i++) {
        if (this.projects[i] != null) {
          if (this.projects[i].status == '1') {
            this.update = (this.projects[i].update == 'null') ? this.projects[i].update_color : this.projects[i].update;
            var updateDate = new Date(this.update);
            let now = new Date();
            let launchDate = new Date(this.projects[i].launch_date);
            this.remTime = launchDate.getTime() - now.getTime();
            this.timeStamp = launchDate.getTime() - updateDate.getTime();
            this.remTimeArr[i] = launchDate.getTime() - now.getTime();
            this.timeStampArr[i] = launchDate.getTime() - updateDate.getTime();
            this.sec = Math.floor(this.remTime / 1000);
            this.min = Math.floor(this.sec / 60);
            this.hour = Math.floor(this.min / 60);
            this.day = Math.floor(this.hour / 24);
            this.hour %= 24;
            this.min %= 60;  
            this.sec %= 60;

            this.hour = (this.hour < 10) ? '0' + this.hour : this.hour;
            this.min = (this.min < 10) ? '0' + this.min : this.min;
            this.sec = (this.sec < 10) ? '0' + this.sec : this.sec;

            this.day = (this.day <= '0') ? '0' : this.day;
            this.hour = (this.hour <= '00') ? '00' : this.hour;
            this.min = (this.min <= '00') ? '00' : this.min;
            this.sec = (this.sec <= '00') ? '00' : this.sec;

            if (this.day <= '0' && this.hour <= '00' && this.min <= '00' && this.sec <= '00') {
              this.projects[i].status = '2';
              this.notification.patchData(this.projects[i].project);
            }
            this.projects.push(createCountDown((i + 1).toString(), this.projects[i]._id, this.projects[i].project,
              this.projects[i].product_owner, this.projects[i].status, this.projects[i].launch_date, this.projects[i].numberLong,
              this.day, this.hour, this.min, this.sec, this.projects[i].detail, this.projects[i].updated_at,
              this.projects[i].update_color, this.projects[i].update, this.projects[i].sticky));
          }
        }
      }
      this.projects.splice(0, this.count);
      this.projects = this.projects.sort((a, b) => {
        if (a.sticky == b.sticky) {
          this.sorting = a.numberLong > b.numberLong ? 1 : -1;
          if (a.numberLong == b.numberLong) {
            this.sorting = a.project > b.project ? 1 : -1;
            if (a.project == b.project) {
              this.sorting = a.product_owner.name > b.product_owner.name ? 1 : -1;
            }
          }
          return this.sorting;
        }
        else {
          return a.sticky > b.sticky ? -1 : 1;
        }
      });
    });
  }

  setColorList() {
    var projectcount = 0
    for (let i = 0; i < this.count; i++) {
      this.list[i] = document.getElementById((i + 1).toString());
      if (this.projects[i] != null) {
        this.listImages[i] = document.getElementById((this.projects[i]._id).toString());
      }
    }
    for (let i = 0; i < this.count; i++) {
      if (this.projects[i] != null) {
        (this.projects[i].sticky == '0') ?
          this.renderer.setStyle(this.listImages[i], 'background-image', "url('assets/images/pin-png-16.png')") :
          this.renderer.setStyle(this.listImages[i], 'background-image', "url('assets/icons/pin_PNG50.png')");
      }
      if (this.list[i] != null) {
        if (this.timeStampArr[i] / 2 < this.remTimeArr[i]) {
          this.renderer.setStyle(this.list[i], 'background-color', '#388e3c');
          this.renderer.addClass(this.list[i], 'green');
          if (this.btnStatus != 'green' && this.btnStatus != null) {
            this.renderer.setStyle(this.list[i], 'display', 'none');
          }
        }
        if (this.timeStampArr[i] / 2 > this.remTimeArr[i] && this.timeStampArr[i] / 4 < this.remTimeArr[i]) {
          this.renderer.setStyle(this.list[i], 'background-color', '#fdd835');
          this.renderer.addClass(this.list[i], 'yellow');
          if (this.btnStatus != 'yellow' && this.btnStatus != null) {
            this.renderer.setStyle(this.list[i], 'display', 'none');
          }
        }
        if (this.timeStampArr[i] / 4 > this.remTimeArr[i]) {
          this.renderer.setStyle(this.list[i], 'background-color', '#CC0000');
          this.renderer.addClass(this.list[i], 'red');
          if (this.btnStatus != 'red' && this.btnStatus != null) {
            this.renderer.setStyle(this.list[i], 'display', 'none');
          }
        }
        if (this.list.length > this.countScroll && this.projects[i] != null && this.list.length == this.projects.length) {
          for (let i = this.countScroll; i < this.list.length; i++) {
            this.renderer.setStyle(this.list[i], 'display', 'none');
          }
        }
        if (this.btnStatus != null) {
          if (this.btnStatus == this.color && this.checkBool == true) {
            for (let i = 0; i < this.countScroll; i++) {
              if (this.list[i] != null) {
                  this.renderer.setStyle(this.list[i], 'display', 'none');
                  if (this.countScroll < this.count) {
                    this.countScroll += 1;
                  }
                  else {
                    break;
                  }
              }
            }
            this.checkBool = false;
          }
        }
      }
      if(this.list[i] != null && this.list[i].className == `eA ${this.color}`)
      {
        projectcount += 1
      }
    }
    if(this.color)
    {
      if(projectcount == 0) {
        this.renderer.setStyle(this.noData, 'display', '')
      }
      else{
        this.renderer.setStyle(this.noData, 'display', 'none');
      }
    }
  }

  openList(_id: string, project: string, po_name: string, po_department: string,
    launch_date: string, detail: string) {
    swal.fire({
      html:
        `<style>@media only screen and (max-width: 1120px) { h1{ font-size: 60px ;} .testview{ font-size: 40px;} .swal2-show{width: 850px;} .swal2-popup{font-size: 30px;} }</style>` +
        `<div class="swl testview">` +
        `<div class="txt" style="text-align:center;width:100%;margin-bottom:20px"><h1>${project}</h1></div>` +
        '<div style="text-align:left;margin-left:20px;margin-right:20px">' +
        `<b >Product owner : </b>${po_name}<br/><br/>` +
        `<b>Department : </b>${po_department}<br/><br/>` +
        `<b>Launch date : </b>${launch_date}<br/><br/>` +
        '<div style="width:100%;">' +
        '<b>Detail : </b>' + `${detail}` +
        '</div>' +
        '</div>' + `</div>`,
    })
  }

  modelChangedDep(value, filter) {
    if (value == "" && this.stat.length > 0 && filter == 'department') {
      for (let i = 0; i < this.stat.length; i++) {
        if ("department" in this.stat[i]) {
          this.stat.splice(i, 1)
          this.states = []
          this.getAlluser().then(() => {
            this.filteredStates = this.stateCtrl.valueChanges
              .pipe(
                startWith(''),
                map(state => state ? this.filterStates('email', state) : this.states.slice())
              );
          });
        }
      }
      (this.stat.length == 1) ? this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString()) :
        (this.stat.length) == 2 ? this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString(), Object.keys(this.stat[1]).toString(), Object.values(this.stat[1]).toString()) :
          this.createList()
    }
  }
  modelChangedEmail(value, filter) {
    if (value == "" && this.stat.length > 0 && filter == 'email') {
      for (let i = 0; i < this.stat.length; i++) {
        if ("email" in this.stat[i]) {
          this.stat.splice(i, 1)
        }
      }
      (this.stat.length == 1) ? this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString()) :
        (this.stat.length) == 2 ? this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString(), Object.keys(this.stat[1]).toString(), Object.values(this.stat[1]).toString()) :
          this.createList()
    }
  }

  onScroll() {
    if (this.countScroll < this.count) {
      this.countScroll = this.countScroll + 5;
      if (this.countScroll > this.count) {
        this.countScroll = this.count;
      }
    }
    this.countScrollDefault = this.countScroll;
  }

  btnColor(name: string) {
    var btn = document.getElementById(name);
    var btns = document.getElementById("btns").querySelectorAll(".btn");
    (name == null) ? this.btnStatus = null : this.btnStatus;
    this.btnStatus = (this.btnStatus == null ? name : this.btnStatus != name ? name : null);
    if (this.btnStatus != null) {
      for (let i = 0; i < btns.length; i++) {
        if (btns[i].id == btn.id) {
          this.checkBool = true;
          this.countScroll = this.countScrollDefault;
          if (btn.id == 'green') {
            this.renderer.setStyle(btn, 'background-color', '#4CAF50');
            this.color = 'green';
          }
          else if (btn.id == 'yellow') {
            this.renderer.setStyle(btn, 'background-color', '#ffe600d7');
            this.color = 'yellow';
          }
          else {
            this.renderer.setStyle(btn, 'background-color', '#DC143C');
            this.color = 'red';
          }
          this.renderer.setStyle(btn, 'color', 'white');
        }
        else {
          this.renderer.removeStyle(btns[i], 'background-color')
          this.renderer.setStyle(btns[i], 'color', 'black')
        }
      }
    }
    else {
      this.color = null
      if(this.noProjects && this.noData != null)
      {
        this.renderer.setStyle(this.noData, 'display', '')
      }
      else if(!this.noProjects && this.noData != null){
        this.renderer.setStyle(this.noData, 'display', 'none')
      }
      for (let i = 0; i < btns.length; i++) {
        this.renderer.removeStyle(btns[i], 'background-color')
        this.renderer.setStyle(btns[i], 'color', 'black')
      }
    }
  }

  stickyClick(_id: string, email: string) {
    this.projectService.getIdProjectList(_id).toPromise().then((data: any) => {
      if (data.sticky == '0') {
        var stickyTime = new Date().getTime() + 2000;
        var stickyTimeFormat = formatDate(new Date(parseInt(stickyTime.toString())), 'yyyy-MM-dd HH:mm:ss', 'en-US');
        var editText = `?&email=${email}&sticky=${stickyTimeFormat}`;
      }
      else {
        var editText = `?&email=${email}&sticky=0`;
      }
      this.projectService.patchProjectList(_id, editText).subscribe(_ => {
        this.projectService.savetolocalStore();
        (this.stat.length == 1) ? this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString()) :
          (this.stat.length) == 2 ? this.checkCreate(Object.keys(this.stat[0]).toString(), Object.values(this.stat[0]).toString(), Object.keys(this.stat[1]).toString(), Object.values(this.stat[1]).toString()) :
            this.createList()
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}

function createCountDown(id: string, _id: string, project: string, product_owner: string, status: string,
  launch_date: string, numberLong: number, day: string, hour: string, minutes: string, second: string, detail: string,
  updated_at: any, update_color: any, update: any, sticky: string): Project {
  return {
    id: id,
    _id: _id,
    project: project,
    product_owner: product_owner,
    status: status,
    launch_date: launch_date,
    numberLong: numberLong.toString(),
    day: day,
    hour: hour,
    minutes: minutes,
    second: second,
    detail: detail,
    updated_at: updated_at,
    update_color: update_color,
    update: update,
    sticky: sticky,
  };
}

export interface Project {
  id: string;
  _id: string;
  project: string;
  product_owner: string;
  status: string;
  launch_date: string;
  numberLong: string;
  day: string;
  hour: string;
  minutes: string;
  second: string;
  detail: string;
  updated_at: any;
  update_color: any
  update: any;
  sticky: string;
}

async function asyncForEach(filter, array, callback) {
  let send = true
  for (let i = 0; i < array.length; i++) {
    if (filter in array[i]) {
      await callback(array[i], i, array);
      send = false
      return true
    }
    if (i == array.length - 1) {
      await callback(null);
      return true
    }
  }
}