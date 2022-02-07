import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { env } from "./../../lib/env/env";
import { urls } from './../../lib/urls/urls';

@Injectable({
  providedIn: 'root'
})
export class PriceManagementService {

  constructor(
    private http: HttpClient,
    private env: env
  ) { }
  getList(page = 1, limit = 10, type?, from?, to?, order?, search?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.price_management_listing) + '/page/' + page + '/limit/' + limit;
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
  getPriceTrend(page = 1, limit = 10, type?, from?, to?, order?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.price_management_view) + '/page/' + page + '/limit/' + limit;
        if (type && type != 0) {
          url += '/type/'+type;
        }
        if (from && to) {
          url += '/from/'+from+'/to/'+to;
        }
        if (order) {
          url += '/order_by_column/'+order['order_by_column']+'/order_by/'+order['order_by'];
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
  save(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.price_management_save);
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
