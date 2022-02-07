import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { env } from "./../../lib/env/env";
import { urls } from './../../lib/urls/urls';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(
    private http: HttpClient,
    private env: env
  ) {

  }
  getList(page = 1, limit = 10, order?, role_id?, from?, to?, search?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.staff_listing) + '/page/' + page + '/limit/' + limit;
        if (order) {
          url += '/order_by_column/'+order['order_by_column']+'/order_by/'+order['order_by'];
        }
        if (role_id && role_id != 0) {
          url += '/role_id/' + role_id;
        }
        if (from && to) {
          url += '/from/' + from + '/to/' + to;
        }
        if (search) {
          url += '?search='+search;
        }
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          console.log('err2', err);
          resolve({ error: 1, message: 'error' });
        });
      });
    });
  }
  viewRecord(id) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.staff_view) + '/id/' + id;
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          console.log('err2', err);
          resolve({ error: 1, message: 'error' });
        });
      });
    });
  }
  getProfile(id) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.staff_profile) + '/id/' + id;
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          console.log('err2', err);
          resolve({ error: 1, message: 'error' });
        });
      });
    });
  }
  save(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.staff_update);
        let request = this.http.post(url, data, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  getRecord(dailyhouse_id) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.staff_index) + '/dailyhouse_id/' + dailyhouse_id;
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          console.log('err2', err);
          resolve({ error: 1, message: 'error' });
        });
      });
    });
  }
}
