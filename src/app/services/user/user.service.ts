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
export class UserService {

  constructor(
    private session: SessionStorageService,
    private http: HttpClient,
    private router: Router,
    private env: env
  ) { }
  saveUser(data) {
    /* console.log("saveUser", data); */
    const formData = new FormData();
		for (let propt in data) {
			formData.append(propt, data[propt]);
		}
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.user_add);
        let request = this.http.post(url, formData, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  updateUser(data) {
    /* console.log("saveUser", data); */
    const formData = new FormData();
		for (let propt in data) {
			formData.append(propt, data[propt]);
		}
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.user_update);
        let request = this.http.post(url, formData, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  confirmPassword(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.user_confirmpass);
        let request = this.http.post(url, data, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  remove(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.user_delete);
        let request = this.http.post(url, data, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
}
