import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { env } from "./../../lib/env/env";
import { urls } from './../../lib/urls/urls';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private env: env
  ) {

  }
  getDashboard(from, to) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.web_dashboard);
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
  getFeedConsumption(from, to) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.feed_consumption);
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
  getMedicineConsumption(from, to) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.med_consumption);
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
  getHarvestStatus(from, to, limit = 5) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.harvest_status);
        if (from) {
          url += '/from/' + from + '/to/' + to;
        }
        if (limit) {
          url += '/limit/' + limit;
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
  getHarvestRate(from, to) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.harvest_rate);
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
  getRecentTransactions(from, to) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.recent_transactions);
        if (from) {
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
  getActivityLog(from, to) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.activity_log);
        if (from) {
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
  getStaffActivities(page = 1, limit = 10, user_id?, from?, to?, code?, order?, search?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.staff_activities) + '/page/' + page + '/limit/' + limit;
        if(user_id){
          url += '/user_id/' + user_id;
        }
        if (from && to) {
          url += '/from/' + from + '/to/' + to;
        }
        if(code){
          url += '/code/' + code;
        }
        if (order) {
          url += '/order_by_column/' + order['order_by_column'] + '/order_by/' + order['order_by'];
        }
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
  getCode(user_role_id?){
    let code: any = [];
    return new Promise(resolve => {
      console.log('userID', user_role_id);

        if (user_role_id == 4) {
          code = [
            {
              label: 'Approved Payment',
              value: 'payment_approved',
            },
            {
              label: 'Approved Order',
              value: 'order_approved',
            },
            {
              label: 'Declined Order',
              value: 'order_decline',
            },
            {
              label: 'Released Order',
              value: 'order_forrelease',
            }
          ];
        }else if(user_role_id==5){
          code = [
            {
              label: 'Approved Payment',
              value: 'payment_approved',
            },
            {
              label: 'Approved Order',
              value: 'order_approved',
            },
            {
              label: 'Declined Order',
              value: 'order_decline',
            },
            {
              label: 'Pickup Order',
              value: 'order_pickup',
            },
            {
              label: 'Released Order',
              value: 'order_forrelease',
            }
          ];
        }else if(user_role_id==6){
          code = [
            {
              label: 'Received Daily House Report',
              value: 'daily_house_report_receive',
            },
            {
              label: 'Received Daily Sorting Report',
              value: 'daily_sorting_report_receive',
            },
            {
              label: 'Approved Daily House Report',
              value: 'daily_house_report_approve',
            },
            {
              label: 'Approved Daily Sorting Report',
              value: 'daily_sorting_report_approve'
            },
            {
              label: 'Sent Daily House Incident Report',
              value: 'incident_report_sentyou_dhr',
            },
            {
              label: 'Sent Daily Sorting Incident Report',
              value: 'incident_report_sentyou_dsr',
            },
            {
              label: 'Approved Daily Harvest Incident Report',
              value: 'incident_report_approve_dhreport',
            },
            {
              label: 'Approved Daily Sorting Incident Report',
              value: 'incident_report_approve_sortedreport',
            }
          ];
        }else if(user_role_id==7){
          code = [
            {
              label: 'Released Order',
              value: 'order_forrelease',
            }
          ];
        } else if (user_role_id == 8) {
          code = [
            {
              label: 'Submit Daily House Report',
              value: 'daily_house_report_submit'
            },
            {
              label: 'Submit Daily House Incident Report',
              value: 'incident_report_submit_flockman'
            }, 
            {
              label: 'File Daily Harvest Incident Report',
              value: 'incident_report_mustfile_dhr',
            }
          ];
        } else if (user_role_id == 9) {
          code = [
            {
              label: 'Submit Daily Sorting Report',
              value: 'daily_sorting_report_submit'
            },
            {
              label: 'Submit Daily Sorting Incident Report',
              value: 'incident_report_submit_sorter'
            },
            {
              label: 'File Daily Sorting Incident Report',
              value: 'incident_report_mustfile_dsr',
            }
          ];
        } else if (user_role_id == 10) {
          code = [
            {
              label: 'Pickup Order',
              value: 'order_pickup',
            }, 
            {
              label: 'Submitted Sack Report',
              value: 'sack_report_submit',
            },
            {
              label: 'Submitted Tray Report',
              value: 'tray_report_submit',
            },
            {
              label: 'Received Daily Sorting Report',
              value: 'daily_sorting_report_receive',
            }
          ];
        }
        if(code.length>0){
          resolve({ error: 0, datas: code });
        }else{
          resolve({ error: 1, message: 'error' });
        }
    });
  }
}
