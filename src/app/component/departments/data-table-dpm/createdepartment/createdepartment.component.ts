import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DepartmentService } from 'src/app/services/department.service';
import { BinService } from 'src/app/services/bin.service';


@Component({
  selector: 'app-createdepartment',
  templateUrl: './createdepartment.component.html',
  styleUrls: ['./createdepartment.component.css']
})
export class CreatedepartmentComponent implements OnInit {
  _id: string;
  department: string;
  addText: string;
  showError: string;

  constructor(private matDialog: MatDialog,
    private departmentService: DepartmentService,
    private binService: BinService) {
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.department != undefined) {
      this.addText = `?department=${this.department}`;
      this.binService.getBin('department').toPromise().then((data: any) => {
        if (data.data.length != 0) {
          for (let i = 0; i < data.data.length; i++) {
            if (this.department == data.data[i].department) {
              this.binService.restoreBin(data.data[i]._id, 'department').subscribe(_ => {
                this.close();
                return false;
              });
            }
            else {
              this.departmentService.postDepartmentList(this.addText).subscribe((data: any) => {
                if ('error' in data) {
                  var log = (data['error']['department'] ? data['error']['department'] : data['error'])
                  alert(this.department + ' ' + log)
                }
                this.close()
              });
            }
          }
        }
        else {
          this.departmentService.postDepartmentList(this.addText).subscribe((data: any) => {
            if ('error' in data) {
              var log = (data['error']['department'] ? data['error']['department'] : data['error'])
              alert(this.department + ' ' + log)
            }
            this.close()
          });
        }
      });
    }
    else{
      this.showError = 'The department field is required.';
    }
  }

  close() {

    this.matDialog.closeAll()
  }
}
