import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { HouseService } from './../../services/house/house.service';
import { EventsService } from 'angular4-events';
import { OrdersService } from './../../services/orders/orders.service'
import { GeneralModalComponent } from './../../components/modals/general-modal/general-modal.component';
import { SessionStorageService } from "ngx-webstorage";
import { AuthService } from "src/app/services/auth/auth.service";
import { AngularFireStoreService } from './../../services/angular-fire-store/angular-fire-store.service';
import { NotificationsService } from './../../services/notifications/notifications.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})

export class TemplateComponent {

  userLogin: any;
  houses: any = [];
  statuscount: any = null;

  isHandset$: Observable<boolean> = null;
  notifCount: number = 0;
  notifPreview: any = [];
  constructor(
    public auth: AuthService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    public session: SessionStorageService,
    private events: EventsService,
    private houseService: HouseService,
    private ordersService: OrdersService,
    private afs: AngularFireStoreService,
    private notificationsService: NotificationsService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches),shareReplay());
    this.events.subscribe('sidebar_house_refresh', (res?) => {
      if (res) {
        this.getHouses();
      }
    });
    this.events.subscribe('user_refresh', (res?) => {
      if (res) {
        this.userLogin = JSON.parse(localStorage.getItem("user"));
      }
    });
    this.events.subscribe('notifications:refresh', () => {
      this.getUserNotificationList();
    });
    this.events.subscribe('notification:showsnackbar', (message?) => {
      if (message) {
        this.showSnackBar(message);
      }
    });
  }
  ngOnInit() {
    this.userLogin = JSON.parse(localStorage.getItem("user"));
    this.getHouses();
    this.getStatuscount();
    this.waitForNotifications();
  }
  async getUserNotificationList() {
    this.notifCount = 0;
    await this.notificationsService.getUserNotificationList(1, 10, true).then((res: any) => {
      if (res.error == 0) {
        this.notifCount = Number(res.total_count);
        this.notifPreview = res.datas;
      }
    });
  }
  async waitForNotifications() {
    await this.afs.getWhere('daily_house_harvest', 'receiver_id', this.userLogin.id).subscribe(res => {
      console.log("waitForNotifications", res);
      if (res['error'] == 0) {
        if (res['data'].length > 0) {
          this.events.publish('notification:showsnackbar', res['data'][0]['message']);
        }
        this.events.publish('notifications:refresh');
        res['data'].forEach(data => {
          if (data.data) {
            this.afs.removeData('daily_house_harvest', data.document_id).then(res => {
              console.log("this.cfs.remove", res);
            });
          }
        });
      }
    });
    await this.afs.getWhere('daily_house_harvest_success', 'receiver_id', this.userLogin.id).subscribe(res => {
      console.log("waitForNotifications", res);
      if (res['error'] == 0) {
        if (res['data'].length > 0) {
          this.events.publish('notification:showsnackbar', res['data'][0]['message']);
        }
        this.events.publish('notifications:refresh');
        res['data'].forEach(data => {
          if (data.data) {
            this.afs.removeData('daily_house_harvest_success', data.document_id).then(res => {
              console.log("this.cfs.remove", res);
            });
          }
        });
      }
    });
    await this.afs.getWhere('daily_house_harvest_received', 'receiver_id', this.userLogin.id).subscribe(res => {
      console.log("waitForNotifications", res);
      if (res['error'] == 0) {
        if (res['data'].length > 0) {
          this.events.publish('notification:showsnackbar', res['data'][0]['message']);
        }
        this.events.publish('notifications:refresh');
        res['data'].forEach(data => {
          if (data.data) {
            this.afs.removeData('daily_house_harvest_received', data.document_id).then(res => {
              console.log("this.cfs.remove", res);
            });
          }
        });
      }
    });
    await this.afs.getWhere('daily_sorted_report', 'receiver_id', this.userLogin.id).subscribe(res => {
      console.log("waitForNotifications", res);
      if (res['error'] == 0) {
        if (res['data'].length > 0) {
          this.events.publish('notification:showsnackbar', res['data'][0]['message']);
        }
        this.events.publish('notifications:refresh');
        res['data'].forEach(data => {
          if (data.data) {
            this.afs.removeData('daily_sorted_report', data.document_id).then(res => {
              console.log("this.cfs.remove", res);
            });
          }
        });
      }
    });
    await this.afs.getWhere('sorted_report_success', 'receiver_id', this.userLogin.id).subscribe(res => {
      console.log("waitForNotifications", res);
      if (res['error'] == 0) {
        if (res['data'].length > 0) {
          this.events.publish('notification:showsnackbar', res['data'][0]['message']);
        }
        this.events.publish('notifications:refresh');
        res['data'].forEach(data => {
          if (data.data) {
            this.afs.removeData('sorted_report_success', data.document_id).then(res => {
              console.log("this.cfs.remove", res);
            });
          }
        });
      }
    });
    await this.afs.getWhere('sorted_report_received', 'receiver_id', this.userLogin.id).subscribe(res => {
      console.log("waitForNotifications", res);
      if (res['error'] == 0) {
        if (res['data'].length > 0) {
          this.events.publish('notification:showsnackbar', res['data'][0]['message']);
        }
        this.events.publish('notifications:refresh');
        res['data'].forEach(data => {
          if (data.data) {
            this.afs.removeData('sorted_report_received', data.document_id).then(res => {
              console.log("this.cfs.remove", res);
            });
          }
        });
      }
    });

    await this.afs.getWhere('new_order', 'receiver_id', this.userLogin.id).subscribe(res => {
      if (res['error'] == 0) {
        if (res['data'].length > 0) {
          this.events.publish('notification:showsnackbar', res['data'][0]['message']);
        }
        this.events.publish('notifications:refresh');
        res['data'].forEach(data => {
          if (data.data) {
            this.afs.removeData('new_order', data.document_id).then(res => {
              console.log("this.cfs.remove", res);
            });
          }
        });
      }
    });

    await this.afs.getWhere('order_cancelled', 'receiver_id', this.userLogin.id).subscribe(res => {
      if (res['error'] == 0) {
        if (res['data'].length > 0) {
          this.events.publish('notification:showsnackbar', res['data'][0]['message']);
        }
        this.events.publish('notifications:refresh');
        res['data'].forEach(data => {
          if (data.data) {
            this.afs.removeData('order_cancelled', data.document_id).then(res => {
              console.log("this.cfs.remove", res);
            });
          }
        });
      }
    });

    await this.afs.getWhere('order_pickup', 'receiver_id', this.userLogin.id).subscribe(res => {
      if (res['error'] == 0) {
        if (res['data'].length > 0) {
          this.events.publish('notification:showsnackbar', res['data'][0]['message']);
        }
        this.events.publish('notifications:refresh');
        res['data'].forEach(data => {
          if (data.data) {
            this.afs.removeData('order_pickup', data.document_id).then(res => {
              console.log("this.cfs.remove", res);
            });
          }
        });
      }
    });

    await this.afs.getWhere('order_completed', 'receiver_id', this.userLogin.id).subscribe(res => {
      if (res['error'] == 0) {
        if (res['data'].length > 0) {
          this.events.publish('notification:showsnackbar', res['data'][0]['message']);
        }
        this.events.publish('notifications:refresh');
        res['data'].forEach(data => {
          if (data.data) {
            this.afs.removeData('order_completed', data.document_id).then(res => {
              console.log("this.cfs.remove", res);
            });
          }
        });
      }
    });
  }
  getHouses() {
    this.houseService.getAllList().then(res => {
      console.log("gethouses", res);
      if (res['error'] == 0) {
        this.houses = res['datas'];
      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  getStatuscount() {
    this.ordersService.getCount().then(res => {
      /* console.log("getStatuscount", res); */
      if (res['error'] == 0) {
        this.statuscount = res['data'];
        console.log("getStatuscount", this.statuscount);
      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  logout() {
    let dialog = this.dialog.open(GeneralModalComponent, {
      width: '400px',
      data: {
        item: null,
        action: 'logout',
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.session.clear();
        this.auth.isLoggedIn();
      }
    });
  }
  gotoPage(notifData) {
    let markasread = {
      notif_id: notifData.id,
      item_id: notifData.item_id,
      type: notifData.type
    };
    this.notificationsService.markNotificationAsRead(markasread).then(res => {
      if (res['error'] == 0) {
        this.events.publish('notifications:refresh');
      }
    }).catch(e => {
      console.log("e", e);
    });
    if (notifData.type >= 1 && notifData.type <= 14) {
      this.router.navigate(['/daily-reports/view', notifData.item_id]);
    } else if (notifData.type >= 15) {
      this.router.navigate(['/transactions/view', notifData.item_id]);
    }
  }
  showSnackBar(message) {
    this._snackBar.open(message, 'Okay', {
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      announcementMessage: message,
      duration: 3000
    });
  }
}
