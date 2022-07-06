import { Component, OnInit, ViewChild, Renderer2, AfterViewChecked } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserService } from 'src/app/services/user.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
import { BinService } from 'src/app/services/bin.service';
import { formatDate } from '@angular/common';
import { FormArray, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { isNull } from 'util';
import swal from 'sweetalert2';


@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.css']
})

export class BinComponent implements OnInit, AfterViewChecked {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<any>;

  displayedProjects: string[] = ['checkbox', 'id', 'project', '_id', 'product_owner', 'launch_date', 'detail', 'tools']
  displayedUsers: string[] = ['checkbox', 'id', '_id', 'firstname', 'lastname', 'department', 'email', 'tools']
  displayedDepartments: string[] = ['checkbox', 'id', '_id', 'department', 'tools']

  public project: boolean
  public user: boolean
  public department: boolean

  myForm: FormGroup;

  searchKey: string;

  count: number;
  idFormArray: any
  collectFormArray: any

  public pagesize

  constructor(
    private userServices: UserService,
    private loginService: LoginService,
    private router: Router,
    private binService: BinService,
    private renderer: Renderer2,
    private fb: FormBuilder
  ) {
  }

  async ngOnInit() {
    this.userServices.loadUser().then((user) => {
      if (Object.values(user).length < 1)
        this.loginService.signOut()
    })
    this.getbinProject()

    this.myForm = this.fb.group({
      _id: this.fb.array([]),
      collect: this.fb.array([])
    });
    await this.loginService.checkUser()

    this.idFormArray = null
    this.collectFormArray = null
  }

  ngAfterViewChecked(): void {
    var key = this.getkeys()
    const list = ['project', 'user', 'department']
    for (let item in list) {
      if (list[item] = key) {
        var btn = document.getElementById(list[item])
      }
    }
    if (btn != null) {
      var btns = document.getElementById("btnCollects").querySelectorAll(".btn");
      for (let i = 0; i < btns.length; i++) {
        if (btns[i].id == btn.id) {
          this.renderer.setStyle(btn, 'background-color', '#4CAF50')
          this.renderer.setStyle(btn, 'color', 'white')
        }
        else {
          this.renderer.removeStyle(btns[i], 'background-color')
          this.renderer.setStyle(btns[i], 'color', 'black')
        }
      }
    }
  }

  createDataTable(point: string) {
    this.binService.getBin(point).toPromise().then((list) => {
      const length = list['data'].length
      if (point == 'Project_list') {
        for (let i = 0; i < length; i++) {
          list['data'].push(createNewProjects(i + 1, list['data'][i]._id, list['data'][i].project, list['data'][i].product_owner.email, list['data'][i].launch_date['$date']['$numberLong'], list['data'][i].detail));
        }
      }
      else if (point == 'Department') {
        for (let i = 0; i < length; i++) {
          list['data'].push(createNewDepartments(i + 1, list['data'][i]._id, list['data'][i].department));
        }
      }
      else {
        for (let i = 0; i < length; i++) {
          list['data'].push(createNewUsers(i + 1, list['data'][i]._id, list['data'][i].firstname, list['data'][i].lastname, list['data'][i].email, list['data'][i].department))
        }
      }
      list['data'].splice(0, length)
      this.dataSource = new MatTableDataSource(list['data'])
      this.paginator.pageSize = list['perPage']
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      if (point == 'Project_list') {
        this.dataSource.filterPredicate = (data, filter) => {
          return this.displayedProjects.some(ele => {
            return ele != "_id" && ele != 'launch_date' && data[ele] != undefined && data[ele].toLowerCase().indexOf(filter) != -1
          });
        }
      }
      else if (point == 'Department') {
        this.dataSource.filterPredicate = (data, filter) => {
          return this.displayedDepartments.some(ele => {
            return ele != "_id" && data[ele] != undefined && data[ele].toLowerCase().indexOf(filter) != -1
          });
        }
      }
      else {
        this.dataSource.filterPredicate = (data, filter) => {
          return this.displayedUsers.some(ele => {
            return ele != "_id" && data[ele] != undefined && data[ele].toLowerCase().indexOf(filter) != -1
          });
        }
      }
    })
  }

  getkeys(): string {
    const listObj = { 'project': this.project, 'user': this.user, 'department': this.department }
    var keys = Object.keys(listObj)
    var filtered = keys.filter(function (key) {
      return listObj[key]
    })
    var key = filtered.toString()
    return key
  }

  getBin(key:string)
  {
    if(key == 'department')
      this.getbinDepartment()
    else if(key == 'project')
      this.getbinProject()
    else if(key == 'user')
      this.getbinUser()
  }

  getbinDepartment() {
    this.dataSource = null
    this.project = false
    this.user = false
    this.department = true
    this.createDataTable('Department')
  }

  getbinProject() {
    this.dataSource = null
    this.project = true
    this.user = false
    this.department = false
    this.createDataTable('Project_list')
  }

  getbinUser() {
    this.dataSource = null
    this.project = false
    this.user = true
    this.department = false
    this.createDataTable('Edit_User')
  }

  restorefrombin(_id: string, name: string, collect: string) {
    swal.fire({
      html:
      '<div style="width:100%;word-wrap: break-word;">'+
      `<h3><b>Do you want to restore </b></h3><h4>${name}<b> ?</b></h4></div>`,
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, restore it!'
    }).then((result) => {
      if (result.value) {
        this.binService.restoreBin(_id, collect).toPromise().then(() => {
          swal.fire(
            'Success!',
            `${name} has been restore !`,
            'success'
          )
          collect == 'Project_list' ? this.getbinProject():collect == 'Department' ? this.getbinDepartment() : this.getbinUser()
        })
      }
    })
  }

  deletefrombin(_id: string, name: string, collect: string) {
    swal.fire({
      html:
      '<div style="width:100%;word-wrap: break-word;">'+
      '<h3><b>Do you want to delete ? </b></h3>'+`<h4>${name}</h4>`+
      '</div>',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.binService.deletefromBin(_id, collect).toPromise().then(() => {
          swal.fire(
            'Deleted!',
            `${name} has been deleted.`,
            'success'
          )
        }).then(() => {
          collect == 'Project_list' ? this.getbinProject() : collect == 'Department' ? this.getbinDepartment() :this.getbinUser()
        })
      }
    })
  }

  RestoreOrDeletefrombin_All(func) {
    var key = this.getkeys()
    var coll = (key == 'project') ? 'Project_list' : (key == 'user') ? 'Edit_User' :'department'
      swal.fire({
        title: (func == "delete") ? (this.idFormArray) ? 'Do you want to delete all selected':`Do you want to delete all ${key} ?`:(this.idFormArray?'Do you want to restore all selected':`Do you want to restore all ${key} ?`),
        text: (func == "delete") ? "You won't be able to revert this!": null,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: (func == "delete") ? 'Delete!' : 'Restore!'
      }).then((result) => {
        if (result.value) {
          if(this.idFormArray!= null && this.idFormArray.length > 0){
            if(func == "delete"){
              for (let i = 0; i < this.idFormArray.length; i++) {
                let indexId = this.idFormArray.controls.findIndex(x => x.value == this.idFormArray.value[i])
                let indexCollect = this.collectFormArray.controls.findIndex(x => x.value == this.collectFormArray.value[i])
                this.binService.deletefromBin(this.idFormArray.value[i], this.collectFormArray.value[i]).toPromise().then(() => {
                  this.idFormArray.removeAt(indexId);
                  this.collectFormArray.removeAt(indexCollect);
                }).then(()=>{
                  this.getBin(key)
                })
              }
            }
            if(func == "restore"){
              for (let i = 0; i < this.idFormArray.length; i++) {

                let indexId = this.idFormArray.controls.findIndex(x => x.value == this.idFormArray.value[i])
                let indexCollect = this.collectFormArray.controls.findIndex(x => x.value == this.collectFormArray.value[i])

                this.binService.restoreBin(this.idFormArray.value[i], this.collectFormArray.value[i]).toPromise().then(() => {
                  this.idFormArray.removeAt(indexId);
                  this.collectFormArray.removeAt(indexCollect);
                }).then(()=>{
                  this.getBin(key)
                })
              }
            }
            swal.fire(
              (func == "delete") ? 'Deleted!' : "Restored!",
              (func == "delete") ? 'Your selected have been deleted.' : 'Your selected have been restored.',
              'success')}
          else{
            this.binService.getBin(coll).toPromise().then((listData) => {
              if(listData['data'].length > 0){
                for (var item in listData['data']) {
                  if(func == "delete")
                  {
                    this.binService.deletefromBin(listData['data'][item]['_id'], coll).toPromise().then(() => {
                      this.getBin(key)
                    })
                  }
                  else if(func == "restore")
                  {
                    this.binService.restoreBin(listData['data'][item]['_id'],  coll).toPromise().then(() => {
                      this.getBin(key)
                    })
                  }
                }
                swal.fire(
                  (func == "delete") ? 'Deleted!' : "Restored!",
                  (func == "delete") ?`${key} have been deleted.`:`${key} have been restored.`,
                  'success')
              }
              else swal.fire((func == "delete") ?'No data to delete!':'No data to restore!')
            })
          }
        }
      })
  }

  onChange(id: string, collect: string, isChecked: boolean) {
    this.idFormArray = <FormArray>this.myForm.controls._id;
    this.collectFormArray = <FormArray>this.myForm.controls.collect;

    if (isChecked) {
      this.idFormArray.push(new FormControl(id));
      this.collectFormArray.push(new FormControl(collect));
    } else {
      let indexId = this.idFormArray.controls.findIndex(x => x.value == id)
      let indexCollect = this.collectFormArray.controls.findIndex(x => x.value == collect)
      this.idFormArray.removeAt(indexId);
      this.collectFormArray.removeAt(indexCollect);
      if (this.idFormArray.length < 1) {
        this.idFormArray = null
      }
      if (this.collectFormArray.length < 1) {
        this.collectFormArray = null
      }
    }
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.toLocaleLowerCase()
  }
}

function createNewProjects(id: number, _id: string, project: string,
  product_owner: string, launch_date: string, detail: string): binProjects {
  return {
    id: id.toString(),
    _id: _id,
    project: project,
    product_owner: product_owner,
    launch_date: launch_date,
    detail: detail,
  }
}

function createNewDepartments(id: number, _id: string, department: string): binDepartments {
  return {
    id: id.toString(),
    _id: _id,
    department: department,
  }
}

function createNewUsers(id: number, _id: string, firstname: string,
  lastname: string, email: string, department: string): binUsers {
  return {
    id: id.toString(),
    _id: _id,
    firstname: firstname,
    lastname: lastname,
    email: email,
    department: department,
  }
}

export interface binProjects {
  id: string;
  _id: string;
  project: string;
  product_owner: string;
  launch_date: string;
  detail: string;
}

export interface binDepartments {
  id: string;
  _id: string;
  department: string;
}

export interface binUsers {
  id: string;
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  department: string;
}