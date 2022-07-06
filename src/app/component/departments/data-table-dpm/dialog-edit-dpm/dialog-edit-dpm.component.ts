import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentService } from 'src/app/services/department.service';
import { Department } from 'src/app/component/departments/data-table-dpm/data-table-dpm.component';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-dialog-edit-dpm',
  templateUrl: './dialog-edit-dpm.component.html',
  styleUrls: ['./dialog-edit-dpm.component.css']
})
export class DialogEditDPMComponent implements OnInit {
  _id:string;
  department: string;
  department2: string;

  selectDepartment: string;
  departments: Department[] | any = [];
  editText: string;
  selectChange(event: any) {
    this.department = event.target.value;
  }

  constructor(private matDialog: MatDialog, private departmentService:DepartmentService,private userService:UserService){
   
  }

  ngOnInit() {
    if(localStorage.getItem('department')  != null){
      this._id = localStorage.getItem('_id');
      this.department = localStorage.getItem('department');
      this.department2 = localStorage.getItem('department');
    }
  }

  save() {
    this.editText = `?department=${this.department}`;
    this.userService.getUserList().toPromise().then((data: any) => {
      for (let i = 0; i < data.data.length; i++) {
        if (this.department2 == data.data[i].department) {
          this.editText = `?department=${this.department}`;
          this.userService.patchUserList(data.data[i]._id, this.editText).subscribe(_ => {
          });
          this.departmentService.patchDepartmentList(this._id, this.editText).subscribe(_ => {
            this.close();
          });
      }
      else{
        this.departmentService.patchDepartmentList(this._id, this.editText).subscribe(_ => {
          this.close();
       
        });
      }
    }
    });
  }
  
  close() {
    this.matDialog.closeAll()
  }


}
