import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material';
import { DatePipe } from '@angular/common';

import { MyErrorStateMatcher } from '../_helpers/myErrorStateMatcher';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = new User;
  checkPassword = '';
  myForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  returnURL = '/';
  maxDate = new Date();

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private datepipe: DatePipe) {
    this.maxDate = new Date(this.maxDate.getFullYear()-18, this.maxDate.getMonth(), this.maxDate.getDate());
    this.route.queryParams.subscribe(params => {
      this.returnURL = params['ReturnURL'];
    });
    this.myForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
    }, { validator: this.checkPasswords });
    this.dateAdapter.setLocale('de');
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  ngOnInit() {
  }

  register(){
    if(this.myForm.valid){
        this.user.firstName = this.myForm.controls.firstName.value;
        this.user.lastName = this.myForm.controls.lastName.value;
        let birthDate = new Date(this.myForm.controls.birthDate.value);
        this.user.birthDate = this.datepipe.transform(birthDate, 'dd.MM.yyyy');
        this.user.email = this.myForm.controls.email.value;
        this.user.password = this.myForm.controls.password.value;
        this.authenticationService.signup(this.user);
        this.router.navigateByUrl(this.returnURL);
    }
  }

}
