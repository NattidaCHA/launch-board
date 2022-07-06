import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material/';
import { DialogEditProjectsComponent } from './dialog-edit-projects/dialog-edit-projects.component';
import { DialogCreateProjectsComponent } from './dialog-create-projects/dialog-create-projects.component'
import { DialogShowProjectsComponent } from './dialog-show-projects/dialog-show-projects.component'
import { ProjectService } from '../../../services/project.service'
import { User } from '../../../Model/User';
import { UserService } from '../../../services/user.service';
import { formatDate } from '@angular/common';
import swal from 'sweetalert2';
import { interval, Subscribable, Subscription } from 'rxjs';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-data-table-projects',
  templateUrl: './data-table-projects.component.html',
  styleUrls: ['./data-table-projects.component.css']
})
export class DataTableProjectsComponent implements OnInit,OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = ['id', 'project', 'product_owner', 'launch_date', 'detail', '_id', 'tools'];
  filterColumns: string[] = ['id', 'project', 'productowner', 'launch_date', 'detail', '_id', 'tools'];
  searchKey: string;
  projects: Project[] | any = [];
  count: number;
  user: User;
  event: Date | any;
  checkMyDate: Date | any;
  launch_date: string[] | any = [];
  checkMyDate0: any;
  checkMyDate1: any;
  sub:Subscription;
  createSub:Subscription;
  public pagesize;

  constructor(
    private projectServices: ProjectService,
    private matDialog: MatDialog,
    private userServices: UserService,
    private loginService:LoginService ) {
  }

  async ngOnInit() {
    this.event = new Date();
    this.userServices.loadUser().then((data) => {
      this.user = data
      this.createDataTable();
      this.sub = interval(5000)
      .subscribe(() => {
        this.projectServices.getDatalocal().toPromise().then(data=>{
          if(data.count < this.projects.length)
          {
            this.createDataTable(this.paginator.pageSize)
          }
        })
      });
    });
    await this.loginService.checkUser()
  }

  ngAfterViewChecked() {
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

  createDataTable(pagesize: number = null) {
    this.createSub = this.projectServices.getProjectList().subscribe((projectLists: any) => {
      this.projects = projectLists.data;
      this.count = this.projects.length
      if (this.event.length == 2) {
        for (let i = 0; i < this.count; i++) {
          var pj_date = formatDate(new Date(parseInt(projectLists.data[i].launch_date.$date.$numberLong)), 'd MMM yyyy HH:mm:ss', 'en-US')
          this.launch_date[i] = formatDate(new Date(parseInt(projectLists.data[i].launch_date.$date.$numberLong)), 'yyyy MM dd', 'en-US')
          this.checkMyDate0 = formatDate(new Date(parseInt(this.checkMyDate[0].getTime())), 'yyyy MM dd', 'en-US');
          this.checkMyDate1 = formatDate(new Date(parseInt(this.checkMyDate[1].getTime())), 'yyyy MM dd', 'en-US');
          if (this.launch_date[i] >= this.checkMyDate0 && this.launch_date[i] <= this.checkMyDate1) {
            projectLists.data.push(createNewProject(i + 1, projectLists.data[i]._id, projectLists.data[i].project,
              projectLists.data[i].product_owner, projectLists.data[i].launch_date.$date.$numberLong, projectLists.data[i].detail, projectLists.data[i].product_owner.name, pj_date));
          }
        }
      }
      else {
        for (let i = 0; i < this.count; i++) {
          var pj_date = formatDate(new Date(parseInt(projectLists['data'][i].launch_date['$date']['$numberLong'])), 'd MMM yyyy HH:mm:ss', 'en-US')
          projectLists.data.push(createNewProject(i + 1, projectLists.data[i]._id, projectLists.data[i].project,
            projectLists.data[i].product_owner, projectLists.data[i].launch_date['$date']['$numberLong'], projectLists.data[i].detail, projectLists.data[i].product_owner.name, pj_date));
        }
      }
      projectLists.data.splice(0, this.count);
      this.dataSource = new MatTableDataSource(this.projects);
      if (pagesize == null)
        this.paginator.pageSize = projectLists['perPage']
      else
        this.paginator.pageSize = pagesize
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.filterColumns.some(element => {
          return element != "launch_date" && element != "_id" && data[element] != undefined && data[element].toLowerCase().indexOf(filter) != -1;
        });
      }
    });
  }

  showProject(_id: string, project: string, product_owner: string, launch_date: string, detail: string, status: string) {
    localStorage.setItem('_id', _id);
    localStorage.setItem('product_owner.email', product_owner);
    localStorage.setItem('project', project);
    localStorage.setItem('launch_date', launch_date);
    localStorage.setItem('detail', detail);
    localStorage.setItem('status', status);

    this.matDialog.open(DialogShowProjectsComponent, {
      width: '700px',
      
    });
  }

  editProject(_id: string, project: string, product_owner: string, launch_date: string, detail: string, status: string) {
    localStorage.setItem('_id', _id);
    localStorage.setItem('product_owner.email', product_owner);
    localStorage.setItem('project', project);
    localStorage.setItem('launch_date', launch_date);
    localStorage.setItem('detail', detail);
    localStorage.setItem('status', status);

    let dialog = this.matDialog.open(DialogEditProjectsComponent, {
      width: '700px',
      height:'570px',
    });
    dialog.afterClosed().subscribe(() => {
      this.createDataTable(this.paginator.pageSize)
    });
  }

  createProject() {
    let dialog = this.matDialog.open(DialogCreateProjectsComponent, {
      width: '700px',
      height:'530px',
     

    });
    dialog.afterClosed().subscribe(() => {
      this.createDataTable(this.paginator.pageSize)
    });
  }

  deleteProject(_id: string, project: string) {
    swal.fire({
      html:
        '<div style="width:100%;word-wrap: break-word;">' +
        '<h3><b>Do you want to delete Project ? </b></h3>' + `<h4>${project}</h4>` +
        '</div>',

      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.projectServices.deleteProjectList(_id).toPromise().then(() => {
          swal.fire(
            'Deleted!',
            `${project} has been deleted.`,
            'success'
          )
        }).then(() => {
          this.ngOnInit()
          this.projectServices.savetolocalStore()
        })
      }
    })
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

  ngOnDestroy(): void {
    this.createSub.unsubscribe()
    this.sub.unsubscribe()
  }
}

function createNewProject(id: number, _id: string, project: string,
  product_owner: string, launch_date: string, detail: string, productowner: string, store_launchDate: string): Project {
  return {
    id: id.toString(),
    _id: _id,
    project: project,
    product_owner: product_owner,
    launch_date: launch_date,
    detail: detail,
    productowner: productowner,
    store_launchDate: store_launchDate,
  };
}

export interface Project {
  id: string;
  _id: string;
  project: string;
  product_owner: string;
  launch_date: string;
  detail: string;
  productowner: string;
  store_launchDate: string;
}