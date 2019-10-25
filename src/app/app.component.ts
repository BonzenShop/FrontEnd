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

  get isLoggedIn() {
    return this.currentUser ? true : false;
  }

  get isAdmin() {
      return this.currentUser && this.currentUser.role === Role.Admin;
  }

  login(){
    if(this.email != '' && this.password != ''){
      this.authenticationService.login(this.email, this.password);
      
    }
    this.email = '';
    this.password = '';
  }

  logout(){
    this.authenticationService.logout();
  }

  get loading(){
    return this.authenticationService.loading;
  }
}
