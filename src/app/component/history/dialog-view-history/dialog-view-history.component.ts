import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-dialog-view-history',
  templateUrl: './dialog-view-history.component.html',
  styleUrls: ['./dialog-view-history.component.css']
})
export class DialogViewHistoryComponent implements OnInit {
  _id: string;
  product_owner: string;
  project_name: string;
  launch: string;
  date: string;
  detail: string;
  time: string;
  editText: string;
  addText: string;
  check: string;
  status: string;


  constructor(private matDialog: MatDialog) { }

  ngOnInit() {
    if (localStorage.getItem('_id') != null) {
      this._id = localStorage.getItem('_id');
      this.product_owner = localStorage.getItem('product_owner.email');
      this.project_name = localStorage.getItem('project');
      this.launch = localStorage.getItem('launch_date');
      this.detail = localStorage.getItem('detail');
      this.date = formatDate(this.launch,'yyyy-MM-dd','en-US');
      this.time = formatDate(this.launch,'HH:mm','en-US');
   
      // this.launchdate = formatDate(new Date(this.launch).toLocaleDateString('en-US'), 'yyyy-MM-dd', 'en-US');
     
      // this.launch_time = formatDate(new Date(this.launch), 'HH:mm', 'en-US');
     
    }
  }

  close() {
    this.matDialog.closeAll()
  }


}
