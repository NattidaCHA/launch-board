import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material/';
import { UserService } from 'src/app/services/user.service';
import { DialogEditComponent } from './dialog-edit/dialog-edit.component';
import { User } from 'src/app/Model/User'
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ProjectService } from 'src/app/services/project.service';
import swal from 'sweetalert2';
import { DialogShowComponent } from './dialog-show/dialog-show.component'

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;

  user: User
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'email', 'department', '_id', 'tools'];

  searchKey: string;
  users: User[] | any = [];
  count: number;
  editText: string;
  
  constructor(private userServices: UserService,
    private matDialog: MatDialog,
    private loginService: LoginService,
    private router: Router,
    private projectService: ProjectService) {

  }

  async ngOnInit() {
    await this.loginService.checkUser()
    this.userServices.loadUser().then((user) => {
      this.user = user
      this.createDataTable();
    })
  }

  createDataTable(pagesize:number = null) {
    this.userServices.getUserList().subscribe((userLists: any) => {
      this.users = userLists.data;
      this.count = userLists.data.length;
      for (let i = 0; i < this.count; i++) {
        userLists.data.push(createNewUser(i + 1, userLists.data[i]._id, userLists.data[i].firstname,
          userLists.data[i].lastname, userLists.data[i].email, userLists.data[i].department));
      }
      this.users.splice(0, this.count);
      this.dataSource = new MatTableDataSource(this.users);
      if(pagesize == null)
        this.paginator.pageSize = userLists['perPage']
      else
        this.paginator.pageSize = pagesize
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != "_id" && data[ele] != undefined && data[ele].toLowerCase().indexOf(filter) != -1;
        });
      }
    });
  }

  editUser(_id: string, email: string, firstname: string, lastname: string, department: string) {
    localStorage.setItem('_id', _id);
    localStorage.setItem('firstname', firstname);
    localStorage.setItem('lastname', lastname);
    localStorage.setItem('department', department);
    localStorage.setItem('email', email);
    this.matDialog.open(DialogEditComponent, {
      width: '700px',
    }).afterClosed().subscribe(() => {
      this.createDataTable(this.paginator.pageSize);
      this.projectService.getProjectList().toPromise().then((data: any) => {
        for (let i = 0; i < data.data.length; i++) {
          if (email == data.data[i].product_owner.email) {
            this.editText = `?email=${email}`;
            this.projectService.patchProjectList(data.data[i]._id, this.editText).subscribe(_ => {
              this.projectService.sendpushNoti()
              if(localStorage.getItem('UserChanged') == 'true'){
                return false;
              } else{
                localStorage.setItem('UserChanged','true')
              }
            });
          }
        }
      });
    });
  }
  showUser(_id: string, email: string, firstname: string, lastname: string, department: string) {
    localStorage.setItem('_id', _id);
    localStorage.setItem('firstname', firstname);
    localStorage.setItem('lastname', lastname);
    localStorage.setItem('department', department);
    localStorage.setItem('email', email);
    
    this.matDialog.open(DialogShowComponent, {
      width: '500px',
    });
  }

  deleteUser(_id: string, email: string) {
    swal.fire({
      html:
      '<div style="width:100%;word-wrap: break-word;">'+
      '<h3><b>Do you want to delete User ? </b></h3>'+`<h4>${email}</h4>`+
      '</div>',
     
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.userServices.deleteUserList(_id).toPromise().then(()=>{
          swal.fire(
            'Deleted!',
            `${email} has been deleted.`,
            'success'
          )
        }).then(()=>{
          this.ngOnInit();
        })
      }
    })
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.toLowerCase();
  }
}

function createNewUser(id: number, _id: string, firstname: string,
  lastname: string, email: string, department: string): tableUser {
  return {
    id: id.toString(),
    _id: _id,
    firstname: firstname,
    lastname: lastname,
    email: email,
    department: department,
  };
}

export interface tableUser {
  id: string;
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  department: string;
}
