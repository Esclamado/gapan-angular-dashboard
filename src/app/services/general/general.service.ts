import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { env } from "./../../lib/env/env";
import { urls } from './../../lib/urls/urls';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    private http: HttpClient,
    private env: env
  ) { }
  getActivity(page, house_id?, order_status?, mode_of_payment?, id?, date?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.general_activity) + '/page/' + page;
        if ((page == 'daily_sorting_reports_listing' || page == 'daily_reports_listing') && house_id) {
          url += '/house_id/' + house_id;
        }
        if (page == 'transactions_listing' && order_status) {
          url += '/order_status/' + order_status;
        }
        if (page == 'transactions_listing' && mode_of_payment) {
          url += '/mode_of_payment/' + mode_of_payment;
        }
        if ((page == 'sacks_view' || page == 'trays_view' || page == 'payment_attachment_listing') && id) {
          url += '/id/' + id;
        }
        if (page == 'fresh_egg_inventory_view' && date) {
          url += '/date/' + date;
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
