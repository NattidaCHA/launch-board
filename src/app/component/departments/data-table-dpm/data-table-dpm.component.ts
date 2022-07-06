import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DepartmentService } from 'src/app/services/department.service';
import { DialogEditDPMComponent } from '../data-table-dpm/dialog-edit-dpm/dialog-edit-dpm.component';
import { CreatedepartmentComponent } from './createdepartment/createdepartment.component';
import { UserService } from 'src/app/services/user.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-data-table-dpm',
  templateUrl: './data-table-dpm.component.html',
  styleUrls: ['./data-table-dpm.component.css']
})
export class DataTableDPMComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<Department>;

  displayedColumns: string[] = ['id', 'department', '_id', 'tools'];

  searchKey: string;
  departments: Department[] | any = [];
  editText: string;
  count: number;
  constructor(
    private departmentService: DepartmentService,
    private matDialog: MatDialog,
    private userServices: UserService,
    private loginService: LoginService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.userServices.loadUser().then((user) => {
      if (Object.values(user).length < 1)
        this.loginService.signOut()
    })
    this.createDataTable();
    await this.loginService.checkUser()
  }

  createDataTable(pagesize: number = null) {
    this.departmentService.getDepartmentList().subscribe((departmentLists: any) => {
      this.departments = departmentLists.data
      this.count = departmentLists.data.length
      for (let i = 0; i < this.count; i++) {
        departmentLists.data.push(createNewDepartment(i + 1, departmentLists.data[i]._id, departmentLists.data[i].department))
      }
      this.departments.splice(0, this.count)
      this.dataSource = new MatTableDataSource(this.departments)
      if (pagesize == null)
        this.paginator.pageSize = departmentLists['perPage']
      else
        this.paginator.pageSize = pagesize
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != "_id" && data[ele] != undefined && data[ele].toLowerCase().indexOf(filter) != -1;
        })
      }
    })
  }

  createDepartment() {
    let dialog = this.matDialog.open(CreatedepartmentComponent, {
      width: '500px',
    });
    dialog.afterClosed().subscribe(() => {
      this.createDataTable(this.paginator.pageSize);
    });
  }

  editDepartment(_id: string, department: string  ) {
    localStorage.setItem('_id', _id);
    localStorage.setItem('department', department);
    this.matDialog.open(DialogEditDPMComponent, {
      width: '400px',
    }).afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  deleteDepartment(_id: string, department: string) {
    swal.fire({
      html:
      '<div style="width:100%;word-wrap: break-word;">'+
      '<h3><b>Do you want to delete Department? </b></h3>'+`<h4>${department}</h4>`+
      '</div>',
  
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if(result.value){
        this.userServices.getUserList().toPromise().then((data: any) => {
          for (let i = 0; i < data.data.length; i++) {
            if (department == data.data[i].department) {
              swal.fire({
                title: `Oops...`,
                text: "The department is in use!",
                type: 'error',
              })
              break;
            }
            else if(i == data.data.length-1){
              this.departmentService.deleteDepartmentList(_id).toPromise().then(() => {
                swal.fire(
                  'Deleted!',
                  `${department} has been deleted.`,
                  'success'
                )
              }).then(() => {
                this.ngOnInit();
              })
            }
          }
        });
      }
    })
  }

  

  applyFilter() {
    this.dataSource.filter = this.searchKey.toLocaleLowerCase();
  }
}

function createNewDepartment(id: number, _id: string, department: string): Department {
  return {
    id: id.toString(),
    _id: _id,
    department: department,
  };
}
export interface Department {
  id: string;
  _id: string;
  department: string;
}
