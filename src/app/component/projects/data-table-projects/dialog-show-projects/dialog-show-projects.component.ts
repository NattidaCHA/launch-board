import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { ProjectService } from 'src/app/services/project.service';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-dialog-show-projects',
  templateUrl: './dialog-show-projects.component.html',
  styleUrls: ['./dialog-show-projects.component.css']
})
export class DialogShowProjectsComponent implements OnInit {

  _id: string;
  product_owner: string;
  project_name: string;
  launch: string;
  launchdate: string;
  detail: string;
  launch_time: string;
  editText: string;
  addText: string;
  check: string;
  status: string;

  
  constructor(private matDialog: MatDialog,) {

    }
  ngOnInit() {
    if (localStorage.getItem('_id') != null) {
      this._id = localStorage.getItem('_id');
      this.product_owner = localStorage.getItem('product_owner.email');
      this.project_name = localStorage.getItem('project');
      this.launch = localStorage.getItem('launch_date');
      this.detail = localStorage.getItem('detail');
      this.launchdate = formatDate(new Date(this.launch).toLocaleDateString('en-US'), 'yyyy-MM-dd', 'en-US');
      this.launch_time = formatDate(new Date(this.launch), 'HH:mm', 'en-US');
     

    }

  }

  close() {
    this.matDialog.closeAll()
  }

 
}