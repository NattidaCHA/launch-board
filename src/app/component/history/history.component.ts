import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { UserService } from 'src/app/services/user.service';
import { LoginService } from 'src/app/services/login.service';
import { formatDate } from '@angular/common';
import { HistoryService } from 'src/app/services/history.service';

import { DialogViewHistoryComponent } from './dialog-view-history/dialog-view-history.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = ['id', 'project', 'product_owner', 'launch_date', 'detail', '_id', 'tools'];
  filterColumns: string[] = ['id', 'project', 'productowner', 'launch_date', 'detail'];
  searchKey: string;
  projects: Project[] | any = [];
  count: number;
  btnStatus: string;

  bookmark: string[] | any = [];
  status: string[] | any = [];

  event: Date | any;
  checkMyDate: Date | any;
  launch_date: string[] | any = [];
  checkMyDate0: any;
  checkMyDate1: any;
  public pagesize

  constructor(
    private userServices: UserService,
    private loginService: LoginService,
    private matDialog: MatDialog,
    private history: HistoryService,
    private renderer: Renderer2

  ) { }

  async ngOnInit() {
    this.event = new Date();
    this.userServices.loadUser().then((user) => {
      if (Object.values(user).length < 1)
        this.loginService.signOut()
    })
    this.createDataTable()
    await this.loginService.checkUser()
  }

  ngAfterViewChecked() {
    this.setColorStatus();
    if (this.event == null) {
      this.event = new Date();
    }
    if (this.event.length == 2) {
      this.checkMyDate = this.event;
    }
    else {
      this.checkMyDate = undefined;
    }
  }

  btnbgColor(name: string) {
    var btn = document.getElementById(name)
    var btns = document.getElementById("status").querySelectorAll(".btn");
    if (btn != null) {
      for (let i = 0; i < btns.length; i++) {
        if (btns[i].id == btn.id) {
          (btn.id == 'done' ? this.renderer.setStyle(btn, 'background-color', '#4CAF50') : this.renderer.setStyle(btn, 'background-color', '#DC143C'))
          this.renderer.setStyle(btn, 'color', 'white')

        }
        else {
          this.renderer.removeStyle(btns[i], 'background-color')
          this.renderer.setStyle(btns[i], 'color', 'black')
        }
      }
    }
    else {
      for (let i = 0; i < btns.length; i++) {
        this.renderer.removeStyle(btns[i], 'background-color')
        this.renderer.setStyle(btns[i], 'color', 'black')
      }
    }
  }

  createDataTable(status: string = null, btn: string = null) {
    this.dataSource = null;
    this.btnStatus = (this.btnStatus == null ? btn : this.btnStatus != btn ? btn : this.btnStatus = null);
    this.btnbgColor(this.btnStatus);
    (status == null && this.btnStatus == null ? this.history.getHistory() : this.btnStatus == null ? this.history.getHistory() : this.history.getHistory(status))
      .subscribe((projectLists: any) => {
        this.projects = projectLists.data;
        this.count = projectLists.data.length;
        if (this.event.length == 2) {
          for (let i = 0; i < this.count; i++) {
            this.launch_date[i] = formatDate(new Date(parseInt(projectLists.data[i].launch_date.$date.$numberLong)), 'yyyy MM dd', 'en-US')
            this.checkMyDate0 = formatDate(new Date(parseInt(this.checkMyDate[0].getTime())), 'yyyy MM dd', 'en-US');
            this.checkMyDate1 = formatDate(new Date(parseInt(this.checkMyDate[1].getTime())), 'yyyy MM dd', 'en-US');
            if (this.launch_date[i] >= this.checkMyDate0 && this.launch_date[i] <= this.checkMyDate1) {
              projectLists.data.push(createNewProject(i + 1, projectLists.data[i]._id, projectLists.data[i].project,
                projectLists.data[i].product_owner, projectLists.data[i].launch_date['$date']['$numberLong'], projectLists.data[i].detail, projectLists.data[i].status, projectLists.data[i].product_owner.name));

              this.status[i] = projectLists.data[i].status;
            }
          }
        }
        else {
          for (let i = 0; i < this.count; i++) {
            projectLists.data.push(createNewProject(i + 1, projectLists.data[i]._id, projectLists.data[i].project,
              projectLists.data[i].product_owner, projectLists.data[i].launch_date['$date']['$numberLong'], projectLists.data[i].detail, projectLists.data[i].status, projectLists.data[i].product_owner.name));

            this.status[i] = projectLists.data[i].status;
          }
        }
        this.projects.splice(0, this.count);
        this.dataSource = new MatTableDataSource(this.projects);
        this.paginator.pageSize = projectLists['perPage']
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data, filter) => {
          return this.filterColumns.some(element => {
            return element != "launch_date" && element != "_id" && data[element] != undefined && data[element].toLowerCase().indexOf(filter) != -1;
          });
        }
      });
  }

  showHistory(_id: string, project: string, product_owner: string, launch_date: string, detail: string) {
    localStorage.setItem('_id', _id);
    localStorage.setItem('product_owner.email', product_owner);
    localStorage.setItem('project', project);
    localStorage.setItem('launch_date', launch_date);
    localStorage.setItem('detail', detail);

    this.matDialog.open(DialogViewHistoryComponent, {
      width: '700px',
    });
  }

  setColorStatus() {
    for (let i = 0; i <= this.count; i++) {
      this.bookmark[i] = document.getElementById((i + 1).toString());
      if (this.bookmark[i] != null) {
        if (this.status[i] == '0') {
          this.renderer.setStyle(this.bookmark[i], 'color', 'green')
        }
        else {
          this.renderer.setStyle(this.bookmark[i], 'color', 'red')
        }
      }
    }
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.toLowerCase();
  }

  dateFilter(event: any) {
    this.event = this.checkMyDate;
  }

  filter(event: any) {
    if (this.checkMyDate != null && event.target.value != '') {
      this.dataSource.filter = this.event.toString().toLowerCase();
    }
    this.createDataTable();
  }
}

function createNewProject(id: number, _id: string, project: string,
  product_owner: string, launch_date: string, detail: string, status: string, productowner: string): Project {
  return {
    id: id.toString(),
    _id: _id,
    project: project,
    product_owner: product_owner,
    launch_date: launch_date,
    detail: detail,
    status: status,
    productowner: productowner,


  };
}

export interface Project {
  id: string;
  _id: string;
  project: string;
  product_owner: string;
  launch_date: string;
  detail: string;
  status: string;
  productowner: string;


}
