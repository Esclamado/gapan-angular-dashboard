import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { env } from "./../../lib/env/env";
import { urls } from './../../lib/urls/urls';

@Injectable({
  providedIn: 'root'
})
export class DailyReportsService {

  constructor(
    private http: HttpClient,
    private env: env
  ) {

  }
  getList(page = 1, limit = 10, type?, flockman_id?, from?, to?, order?, search?) {
    console.log(order);
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.daily_listing) + '/page/' + page + '/limit/' + limit;
        if (type && type != 0) {
          url += '/type/'+type;
        }
        if (flockman_id && flockman_id != 0) {
          url += '/flockman_id/'+flockman_id;
        }
        if (from && to) {
          url += '/from/'+from+'/to/'+to;
        }
        if (order) {
          url += '/order_by_column/'+order['order_by_column']+'/order_by/'+order['order_by'];
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
  getRecord(page = 1, limit = 10, house_id?, type?, from?, to?, order?, search?) {
    console.log('type', type);
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.daily_index) + '/page/'+page+'/limit/'+limit+'/house_id/' + house_id;
        if (type && type != 0) {
          url += '/type/'+type;
        }
        if (from && to) {
          url += '/from/'+from+'/to/'+to;
        }
        if (order) {
          url += '/order_by_column/'+order['order_by_column']+'/order_by/'+order['order_by'];
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
  getSortingRecord(house_harvest_id) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.daily_sorting_index) + '/house_harvest_id/'+house_harvest_id;
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
