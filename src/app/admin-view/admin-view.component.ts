import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
/**
 * admin view - can only be accessed by admin
 */
export class AdminViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
