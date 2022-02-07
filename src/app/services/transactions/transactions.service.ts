import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { env } from "./../../lib/env/env";
import { urls } from './../../lib/urls/urls';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(
    private http: HttpClient,
    private env: env
  ) { }
  getList(page = 1, limit = 10, order?, user_id?, order_status?, payment_status?, mode_of_payment?, from?, to?, search?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.transaction_listing) + '/page/' + page + '/limit/' + limit;
        if (order) {
          url += '/order_by_column/'+order['order_by_column']+'/order_by/'+order['order_by'];
        }
        if (user_id) {
          url += '/user_id/'+user_id;
        }
        if (order_status) {
          url += '/order_status/'+order_status;
        }
        if (payment_status) {
          url += '/payment_status/'+payment_status;
        }
        if (mode_of_payment) {
          url += '/mode_of_payment/'+mode_of_payment;
        }
        if (from && to) {
          url += '/from/' + from + '/to/' + to;
        }
        if (search){
          url += '?search=' + search;
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
  getRecord(order_id) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.transaction_index) + '/order_id/' + order_id;
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
