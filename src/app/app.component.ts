import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services/authentication.service';
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

  constructor(private authenticationService: AuthenticationService, private router: Router){
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
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

  goToHome(){
    this.router.navigate(['/']);
  }
}
