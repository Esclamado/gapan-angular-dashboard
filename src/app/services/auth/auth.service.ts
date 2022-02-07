import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { env } from "./../../lib/env/env";
import { urls } from './../../lib/urls/urls';
import { jwt } from "./../../lib/jwt/jwt";
import { SessionStorageService } from "ngx-webstorage";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private session: SessionStorageService,
    private http: HttpClient,
    private router: Router,
    private env: env
  ) {

  }
  isLoggedIn(): any {
    let token = this.session.retrieve("token");
    if (token) {
      let payload = jwt.getPayload(token);
      if (typeof payload.jti === "undefined") {
        this.router.navigate(["login"]);
      } else {
        this.router.navigate(["dashboard"]);
      }
    } else {
      this.router.navigate(["login"]);
    }
  }
  login(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.admin_login);
        let request = this.http.post(url, data, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  generate(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.generate_password);
        let request = this.http.post(url, data, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  validateUserRole() {
    let userProfile = JSON.parse(localStorage.getItem("user"));
    if (userProfile.user_role_id != 4 && userProfile.user_role_id != 5) {
      this.router.navigate(['transactions-status', 1]);
    }
  }
}
