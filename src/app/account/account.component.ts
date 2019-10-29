import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  currentUser: User;

  constructor(private authenticationService: AuthenticationService){
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
  }

}
