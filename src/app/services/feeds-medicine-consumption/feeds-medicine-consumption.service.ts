import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { env } from "./../../lib/env/env";
import { urls } from './../../lib/urls/urls';

@Injectable({
  providedIn: 'root'
})
export class FeedsMedicineConsumptionService {

  constructor(
    private http: HttpClient,
    private env: env
  ) {

   }
  getList(/* page = 1, limit = 10, */order?, house_id?) {
    console.log(order);
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feedsmeds_consumption)/*  + '/page/' + page + '/limit/' + limit */;
        if (order) {
          url += '/order_by_column/' + order['order_by_column'] + '/order_by/' + order['order_by'];
        }
        if(house_id){
          url += '/house_id/' + house_id;
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
  getHouselist(page = 1, limit = 10, from?, to?, order?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feedsmeds_listing) + '/page/' + page + '/limit/' + limit;
        if (from && to) {
          url += '/from/' + from + '/to/' + to;
        }
        if (order) {
          url += '/order_by_column/' + order['order_by_column'] + '/order_by/' + order['order_by'];
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
  updateFeeds(formdata) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feeds_update);
        let request = this.http.post(url, formdata, httpOptions);
        console.log('url', urls.feeds_update);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  getAllmedicine() {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.medicinemanage_getall);
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
  getAllFeeds() {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feedmanage_getall);
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
  saveMed(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feedsmeds_add);
        let request = this.http.post(url, data, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  getHouserecord(id) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feedsmeds_index) + '/id/' + id;
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  updateMeds(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feedsmeds_updatemed);
        let request = this.http.post(url, data, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  validate() {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feedsmeds_validate);
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
  removeRecord(formData) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feedsmeds_remove);
        let request = this.http.post(url, formData, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
}
