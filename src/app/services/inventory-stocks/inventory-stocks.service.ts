import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { env } from "./../../lib/env/env";
import { urls } from './../../lib/urls/urls';

@Injectable({
  providedIn: 'root'
})
export class InventoryStocksService {

  constructor(
    private http: HttpClient,
    private env: env
  ) {

  }
  getTrayList(page = 1, limit = 10, order?, from?, to?, search?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.tray_listing) + '/page/' + page + '/limit/' + limit;
        if (order) {
          url += '/order_by_column/'+order['order_by_column']+'/order_by/'+order['order_by'];
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
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  getTrayRecord(id) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.tray_view) + '/id/' + id;
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  getSackList(page = 1, limit = 10, order?, from?, to?, search?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.sack_listing) + '/page/' + page + '/limit/' + limit;
        if (order) {
          url += '/order_by_column/'+order['order_by_column']+'/order_by/'+order['order_by'];
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
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  getSackRecord(id) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.sack_view) + '/id/' + id;
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  getEggList(page = 1, limit = 10, order?, from?, to?, search?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.freshegg_listing) + '/page/' + page + '/limit/' + limit;
        if (order) {
          url += '/order_by_column/'+order['order_by_column']+'/order_by/'+order['order_by'];
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
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  getEggRecord(date) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.freshegg_index) + '/date/' + date;
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  search(search?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.show_egg_stocks);
        if (search) {
          url += '?search=' + search;
        }
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
