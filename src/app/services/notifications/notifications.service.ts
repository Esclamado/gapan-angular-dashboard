import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { env } from "./../../lib/env/env";
import { urls } from './../../lib/urls/urls';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private http: HttpClient,
    private env: env
  ) { }
  getUserNotificationList(page = 1, limit = 10, isUnread?) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.notificationslisting) + '/page/' + page + '/limit/' + limit;
        if (isUnread) {
          url += '/isUnread/'+isUnread;
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
  markNotificationAsRead(data) {
    return new Promise(resolve => {
      this.env.getHttpOptions().then(httpOptions => {
        let url = this.env.getUrl(urls.notificationsmarkasread);
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
