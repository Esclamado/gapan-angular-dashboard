import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthService } from './../../../services/auth/auth.service';
import { SessionStorageService } from "ngx-webstorage";
import { Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  show_password: boolean = false;
  isLoading: boolean = false;

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Login',
    spinnerSize: 19,
    raised: false,
    stroked: false,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    customClass: 'btn btn-primary btn-block',
  };

  constructor(
    private auth: AuthService,
    private route: Router,
    private session: SessionStorageService,
    protected formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          /* Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$') */
          Validators.minLength(5)
        ])
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8)
        ])
      ],
      remember_me: [
        false
      ]
    });
  }

  ngOnInit() {
    this.auth.isLoggedIn();
  }

  login() {
    this.btnOps.active = true;
    this.auth.login(this.loginForm.value).then(res => {
      console.log("res", res);
      if (res['error'] == 0) {
        this.session.store("token", res['token']);
        localStorage.setItem("user", JSON.stringify(res['data']));
        console.log('asdasdas', res['data']);
        if (res['data']['user_role_id'] == 4) {
          this.route.navigate(["dashboard"]);
        } else {
          this.route.navigate(['transactions-status', 1]);
        }
      } else {
        this._snackBar.open(res['message'], null, {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          announcementMessage: res['message'],
          duration: 3000
        });
      }
    }).catch(e => {
      console.log("e", e);
      this._snackBar.open(e, null, {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        announcementMessage: e,
        duration: 3000
      });
    });
    setTimeout(() => {
      this.btnOps.active = false;
    }, 1500);
  }
  showPassword() {
    this.show_password = !this.show_password;
  }
}
