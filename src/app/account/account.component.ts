import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';
import { ApiService } from '../_services/api.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  currentUser: User = new User();
  userId = 0;

  constructor(private authService: AuthenticationService, private route: ActivatedRoute, private router: Router, private apiService: ApiService){
    
    this.route.paramMap.subscribe((params) => {
      if(params.has("id")){
        this.userId = +params.get("id");
        this.apiService.getUserList().subscribe((data) => {
          var user = data.find(({id}) => id == this.userId);
          if(user){
            this.currentUser = user;
          }else{
            this.router.navigate(['/Admin/Kontoliste']);
          }
        })
      }else{
        this.authService.currentUser.subscribe((user) => {
          this.currentUser = user;
        });
      }
    });
  }

  ngOnInit() {
  }

}
