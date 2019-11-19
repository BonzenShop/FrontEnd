import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material';
import { DatePipe } from '@angular/common';

import { MyErrorStateMatcher } from '../_helpers/myErrorStateMatcher';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit {

  user = new User;
  checkPassword = '';
  myForm: FormGroup;
  passwordForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  changePassword = false;
  maxDate = new Date();

  constructor(private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private datepipe: DatePipe) {
    this.maxDate = new Date(this.maxDate.getFullYear()-18, this.maxDate.getMonth(), this.maxDate.getDate());
    this.authService.currentUser.subscribe((data) => {
      this.user = JSON.parse(JSON.stringify(data));
    })
    this.myForm = this.formBuilder.group({
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      birthDate: [this.stringToDate(this.user.birthDate), [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
    });
    this.passwordForm = this.formBuilder.group({
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

  save(){
    if(!this.valuesUnchanged() && this.myForm.valid){
        var oldFirstName = this.user.firstName;
        var oldLastName = this.user.lastName;
        var oldBirthDateString = this.user.birthDate;
        var oldBirthDate = this.stringToDate(this.user.birthDate);
        var oldEmail = this.user.email;

        this.user.firstName = this.myForm.controls.firstName.value;
        this.user.lastName = this.myForm.controls.lastName.value;
        let birthDate = new Date(this.myForm.controls.birthDate.value);
        this.user.birthDate = this.datepipe.transform(birthDate, 'dd.MM.yyyy');
        this.user.email = this.myForm.controls.email.value;
        if(this.changePassword && this.passwordForm.valid){
            this.user.password = this.passwordForm.controls.password.value;
        }

        this.authService.changeUserData(this.user, "/Konto");

        this.user.firstName = oldFirstName;
        this.myForm.controls.firstName.setValue(oldFirstName);
        this.user.lastName = oldLastName
        this.myForm.controls.lastName.setValue(oldLastName);
        this.user.birthDate = oldBirthDateString;
        this.myForm.controls.birthDate.setValue(oldBirthDate);
        this.user.email = oldEmail
        this.myForm.controls.email.setValue(oldEmail);
        this.passwordForm.controls.password.setValue("");
        this.passwordForm.controls.confirmPassword.setValue("");
    }
  }

  stringToDate(str: string){
    if ((str.includes('.'))) {
      const strArray = str.split('.');
      
      const year = Number(strArray[2]);
      const month = Number(strArray[1])-1;
      const date = Number(strArray[0]);
      
      return new Date(year, month, date);
    } else {
      return new Date();
    }
  }
  
  doChangePassword() {
    this.changePassword = true;
  }

  doNotChangePassword() {
    this.changePassword = false;
    this.passwordForm.controls.password.setValue("");
    this.passwordForm.controls.confirmPassword.setValue("");
  }

  valuesUnchanged() {
    let birthDate = new Date(this.myForm.controls.birthDate.value);
    return !this.changePassword && (this.user.firstName == this.myForm.controls.firstName.value &&
      this.user.lastName == this.myForm.controls.lastName.value &&
      this.user.birthDate == this.datepipe.transform(birthDate, 'dd.MM.yyyy') &&
      this.user.email == this.myForm.controls.email.value);
  }

}
