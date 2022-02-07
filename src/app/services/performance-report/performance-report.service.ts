import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { env } from "./../../lib/env/env";
import { urls } from './../../lib/urls/urls';

@Injectable({
  providedIn: 'root'
})
export class PerformanceReportService {

  constructor(
    private http: HttpClient,
    private env: env
  ) { }
  getProductionHouse(page = 1, limit = 10, house_id?, from?, to?, order?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.performancereport_productionhouse) + '/page/' + page + '/limit/' + limit;
        if (house_id && house_id != 0) {
          url += '/house_id/'+house_id;
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
  getProductionEggSize(page = 1, limit = 10, house_id?, from?, to?, order?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.performancereport_productioneggsize) + '/page/' + page + '/limit/' + limit;
        if (from && to) {
          url += '/from/'+from+'/to/'+to;
        }
        if (order) {
          url += '/order_by_column/'+order['order_by_column']+'/order_by/'+order['order_by'];
        }
        if (house_id) {
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
  getOverallSales(page = 1, limit = 10, from?, to?, order?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.performancereport_overallsales) + '/page/' + page + '/limit/' + limit;
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
  getSalesByEggSize(page = 1, limit = 10, from?, to?, order?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.performancereport_saleseggsizes) + '/page/' + page + '/limit/' + limit;
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
  getFeedConsumptionReport(page = 1, limit = 10, house_id?, from?, to?, order?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.performancereport_feeds) + '/page/' + page + '/limit/' + limit;
        if (house_id && house_id != 0) {
          url += '/house_id/'+house_id;
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
  getMedicineConsumption(page = 1, limit = 10, from?, to?, order?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.performancereport_medicine) + '/page/' + page + '/limit/' + limit;
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
  getStocks(page = 1, limit = 10, from?, to?, order?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.performancereport_stocks) + '/page/' + page + '/limit/' + limit;
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
  getMedicineconsumption(page = 1, limit = 10, from?, to?, order?, month?, house_id?, med_id?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.performancereport_medicine) + '/page/' + page + '/limit/' + limit;
        if (from && to) {
          url += '/from/' + from + '/to/' + to;
        }
        if (order) {
          url += '/order_by_column/' + order['order_by_column'] + '/order_by/' + order['order_by'];
        }
        if (month){
          url += '/month/' + month;
        }
        if (house_id) {
          url += '/house_id/' + house_id;
        }
        if (med_id) {
          url += '/med_id/' + med_id;
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
  getAllList() {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.house_listing);
        let request = this.http.get(url, httpOptions);
        request.subscribe(result => {
          resolve(result);
        }, err => {
          resolve({ error: 1, message: err });
        });
      });
    });
  }
  getLocationwithhighestorders(page = 1, limit = 10, from?, to?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.production_highestorders) + '/page/' + page + '/limit/' + limit;;
        if (from && to) {
          url += '/from/' + from + '/to/' + to;
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
  getCreditBalance(from?, to?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.production_creditbalance);
        if (from && to) {
          url += '/from/' + from + '/to/' + to;
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
