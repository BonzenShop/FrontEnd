import { Component } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { User } from './_models/user';
import { Role } from './_models/role';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BonzenShop';
  email = '';
  password = '';
  currentUser: User;

  constructor(private authenticationService: AuthenticationService){
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  get isAdmin() {
      return this.currentUser && this.currentUser.role === Role.Admin;
  }

  login(){
    console.log("login "+ this.email+" with password "+this.password);
    if(this.email != '' && this.password != '')
      this.authenticationService.login(this.email, this.password);
  }
}
