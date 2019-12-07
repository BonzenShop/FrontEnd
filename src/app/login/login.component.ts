import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
/**
 * login view
 */
export class LoginComponent implements OnInit {

  myForm: FormGroup;
  returnURL = '/';

  constructor(private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if(params['ReturnURL']){
        this.returnURL = params['ReturnURL'];
      }
    });
    this.authService.currentUser.subscribe((user) => {
      if(user){
        this.router.navigateByUrl(this.returnURL);
      }
    })
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  login(){
    if(this.myForm.valid){
        this.authService.login(this.myForm.controls.email.value, this.myForm.controls.password.value);
        this.myForm.controls.email.setValue("");
        this.myForm.controls.password.setValue("");
    }
  }

  cancel(){
    this.router.navigateByUrl(this.returnURL);
  }

}
