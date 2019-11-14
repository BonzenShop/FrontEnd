import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  userRole = this.currentUser.role;
  userId = 0;
  roles = ["Kunde", "Mitarbeiter", "Admin"];
  showResetBtn = true;

  constructor(private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private _snackBar: MatSnackBar){
    
    this.route.paramMap.subscribe((params) => {
      if(params.has("id")){
        this.userId = +params.get("id");
        this.apiService.getUserList().subscribe((data) => {
          var user = data.find(({id}) => id == this.userId);
          if(user){
            this.currentUser = user;
            this.userRole = user.role;
          }else{
            this.router.navigate(['/Admin/Kontoliste']);
          }
        })
      }else{
        this.authService.currentUser.subscribe((user) => {
          this.currentUser = user;
          this.userRole = user.role;
        });
      }
    });
  }

  ngOnInit() {
  }

  showPopup(message:string){
    this._snackBar.open(message, "OK", {
      duration: 4000,
    });
  }

  save(){
    this.apiService.changeRole({user: this.currentUser.id, role: this.currentUser.role}).subscribe(
      (data) => {
        this.userRole = this.currentUser.role;
      },
      (error) => {
        console.log(error.message);
        this.showPopup("Ändern der Rolle felgeschlagen");
      }
    )
    console.log("save");
  }

  resetPassword(){
    this.apiService.resetPassword(this.currentUser.id).subscribe(
      (data) => {
        this.showPopup("Passwort erfolgreich zurückgesetzt");
        this.showResetBtn = false;
      },
      (error) => {
        console.log(error.message);
        this.showPopup("Zurücksetzen des Passworts felgeschlagen");
      }
    )
    console.log("reset password");
  }

}
