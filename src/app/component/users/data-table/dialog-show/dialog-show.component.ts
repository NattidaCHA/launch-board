import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserService } from 'src/app/services/user.service';
import { DepartmentService } from 'src/app/services/department.service';
import { Department } from 'src/app/component/departments/data-table-dpm/data-table-dpm.component';

@Component({
  selector: 'app-dialog-show',
  templateUrl: './dialog-show.component.html',
  styleUrls: ['./dialog-show.component.css']
})
export class DialogShowComponent implements OnInit {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  department: string;
  departments: Department[] | any = [];
  editText: string;
  selectChange(event: any) {
    this.department = event.target.value;
  }

  constructor(private matDialog: MatDialog,
    private userService: UserService,
    private departmentService: DepartmentService) {
  }

  ngOnInit() {
    if (localStorage.getItem('_id') != null) {
      this._id = localStorage.getItem('_id');
      this.email = localStorage.getItem('email');
      this.firstname = localStorage.getItem('firstname');
      this.lastname = localStorage.getItem('lastname');
      this.department = localStorage.getItem('department');

      this.departmentService.getDepartmentList().toPromise().then((data: any) => {
        for (let i = 0; i < data.data.length; i++) {
          this.departments[i] = data.data[i].department;
        }
      });
    }
  }

  close() {
    this.matDialog.closeAll();
  }

 
}

