import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { env } from "./../../lib/env/env";
import { urls } from './../../lib/urls/urls';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private http: HttpClient,
    private env: env
  ) { }

  save(data, action?) {
    console.log("action", action);
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.order_save);
        if (action) {
          if (action == 'order_approve') {
            url = this.env.getUrl(urls.order_approve);
          } else if (action == 'order_decline') {
            url = this.env.getUrl(urls.order_decline);
          } else if (action == 'order_cancel') {
            url = this.env.getUrl(urls.order_cancel);
          } else if (action == 'payment_add') {
            url = this.env.getUrl(urls.order_forrelease);
          } else if (action == 'transaction_create') {
            url = this.env.getUrl(urls.order_save);
          } else if (action == 'payment_approve') {
            url = this.env.getUrl(urls.mop_approve);
          }
        } 
        let request = this.http.post(url, data, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  getCount() {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.status_count);
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  savePayment(data) {
    const formData = new FormData();
		for (let propt in data) {
			formData.append(propt, data[propt]);
		}
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.order_forrelease);
        
        let request = this.http.post(url, formData, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  getCollectibles(user_id) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.order_collectibles) + '/user_id/' + user_id;
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
}
