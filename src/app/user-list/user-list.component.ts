import { Component, OnInit } from '@angular/core';

import { ApiService } from '../_services/api.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userList: User[]
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'birthDate', 'email', 'role'];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getUserList().subscribe((data)=>{
      this.userList = data;
    });
  }
}
