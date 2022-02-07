import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { env } from "./../../lib/env/env";
import { urls } from './../../lib/urls/urls';

@Injectable({
  providedIn: 'root'
})
export class FeedsMedicineManagementService {

  constructor(
    private http: HttpClient,
    private env: env
  ) { }
  getFeedsList(page = 1, limit = 10, delivery_date?, feed?, expiration_date?, order?, search?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feeds_listing) + '/page/' + page + '/limit/' + limit;
        if (delivery_date) {
          url += '/delivery_date/' + delivery_date;
        }
        if (feed) {
          url += '/feed/' + feed;
        }
        if (expiration_date) {
          url += '/expiration_date/' + expiration_date;
        }
        if (order) {
          url += '/order_by_column/'+order['order_by_column']+'/order_by/'+order['order_by'];
        }
        if (search) {
          url += '?search=' + search;
        }
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          console.log('err', err);
          resolve({ error: 1, message: 'error' });
        });
      });
    });
  }
  getMedicineList(page = 1, limit = 10, delivery_date?, medicine?, expiration_date?, order?, search?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.medicine_listing) + '/page/' + page + '/limit/' + limit;
        if (delivery_date) {
          url += '/delivery_date/' + delivery_date;
        }
        if (medicine) {
          url += '/medicine/' + medicine;
        }
        if (expiration_date) {
          url += '/expiration_date/' + expiration_date;
        }
        if (order) {
          url += '/order_by_column/'+order['order_by_column']+'/order_by/'+order['order_by'];
        }
        if (search) {
          url += '?search=' + search;
        }
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          console.log('err', err);
          resolve({ error: 1, message: 'error' });
        });
      });
    });
  }
  getFeedRecord(id) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feeds_index) + '/id/' + id;
        
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          console.log('err', err);
          resolve({ error: 1, message: 'error' });
        });
      });
    });
  }
  getMedicineRecord(id) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.medicine_index) + '/id/' + id;
        
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          console.log('err', err);
          resolve({ error: 1, message: 'error' });
        });
      });
    });
  }
  saveFeed(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feeds_save);
        let request = this.http.post(url, data, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  saveMedicine(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.medicine_save);
        let request = this.http.post(url, data, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  removeFeed(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feeds_delete);
        let request = this.http.post(url, data, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  removeMedicine(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.medicine_delete);
        let request = this.http.post(url, data, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  getMedicineUnits() {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.medicineunits_listing);
        
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          console.log('err', err);
          resolve({ error: 1, message: 'error' });
        });
      });
    });
  }
  saveMedicineUnit(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.medicineunits_save);
        let request = this.http.post(url, data, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  removeMedicineUnit(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.medicineunits_delete);
        let request = this.http.post(url, data, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  updateFeedsMedsManagement(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feedsmedsmanagement_update);
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
