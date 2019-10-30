import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return (control.parent.controls["password"].touched && control.parent.controls["password"].invalid) || control.parent.controls["password"].value != control.value;
  }
}

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

  constructor(private authenticationService: AuthenticationService, private router: Router, private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: [''],
    }, { validator: this.checkPasswords });

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
        this.user.birthDate = this.myForm.controls.birthDate.value;
        this.user.email = this.myForm.controls.email.value;
        this.user.password = this.myForm.controls.password.value;
        this.authenticationService.signup(this.user);
        this.router.navigate(['/']);
    }
  }

}
