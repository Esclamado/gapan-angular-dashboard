import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from "ngx-webstorage";
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from "@angular/router";
import { datatable } from './../../../../components/datatables/transactions-view/transactions-view';
import { TransactionsService } from './../../../../services/transactions/transactions.service';
import { EventsService } from 'angular4-events';

import { MatDialog } from '@angular/material/dialog';
import { GeneralModalComponent } from './../../../../components/modals/general-modal/general-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmPasswordModalComponent } from 'src/app/components/modals/confirm-password-modal/confirm-password-modal.component';
import { FreshEggInventoryModalComponent } from './../../../../components/modals/fresh-egg-inventory-modal/fresh-egg-inventory-modal.component';
import { AddDiscountModalComponent } from './../../../../components/modals/add-discount-modal/add-discount-modal.component';

@Component({
  selector: 'app-transactions-view',
  templateUrl: './transactions-view.component.html',
  styleUrls: ['./transactions-view.component.scss']
})
export class TransactionsViewComponent implements OnInit {

  item: any = [];
  order_id: number;
  
  ths: any = datatable;
  visible_columns: any = [];

  order_items: any = [];
  isLoaded: boolean = false;

  primary_button: string = 'Approve Order';
  primary_button_action: string = 'order_approve';

  userProfile: any = [];

  timerLabels: any = {
    Hours: "HRS",
    Minutes: "MIN",
    Seconds: "SEC"
  }
  date_today: any = new Date();
  date_to_pickup: any = null;
  display_timer: boolean = false;
  showAction: boolean = false;
  order: any = {
    order_by_column: 'id',
    order_by: 'asc'
  };
  /* display_timer: boolean = this.date_today <= this.date_to_pickup ? true : false; */
  constructor(
    private events: EventsService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private location: Location,
    private route: Router,
    public _route: ActivatedRoute,
    public session: SessionStorageService,
    private transactionsService: TransactionsService
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
    this.events.subscribe('order_refresh', (res?) => {
      if (res) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.userProfile = JSON.parse(localStorage.getItem('user'));
    this._route.params.subscribe(params => {
      this.order_id = params['id'];
      this.getRecord();
    });
  }
  async getRecord() {
    await this.transactionsService.getRecord(this.order_id).then(res => {
      this.isLoaded = true;
      console.log("getRecord", res);
      if (res['error'] == 0) {
        this.item = res['data'];


        this.item.total_price = Number(this.item.total_price) + Number(this.item.discount);
        
        if (this.item.mode_of_payment == 2) {
          this.item.payment.balance = Number(this.item.payment.balance) + Number(this.item.discount);
        } else if (this.item.mode_of_payment == 3) {
          this.item.payment.payment = Number(this.item.payment.payment) + Number(this.item.discount);
        }

        this.display_timer = this.date_today <= new Date(this.item.date_to_pickup) ? true : false;
        this.order_items = res['data']['order_items'];

        this.showAction = false;

        if (this.userProfile.user_role_id == 5) { /* kapag sales */
          if (this.item.order_status == 1 && this.item.mode_of_payment == 1) {
            this.primary_button = 'Approve Order';
            this.primary_button_action = 'order_approve';
            this.showAction = true;
          }

          if (this.item.order_status == 3 && this.item.prepared_by) {
            /* this.primary_button = 'Update Payment';
            this.primary_button_action = 'update_payment';
            this.showAction = true;
            if (this.item.payment_status == 1) {
              this.showAction = false;
            } */
          }
          if (this.item.order_status == 2) {
            this.showAction = true;
          }

          if (this.item.order_status == 1 && this.item.mode_of_payment > 1 && this.item.balance_credit_approved == 1) {
            this.primary_button = 'Approve Order';
            this.primary_button_action = 'order_approve';
            this.showAction = true;
          }
          
        } else if (this.userProfile.user_role_id == 4) { /* kapag manager */
          if (this.item.order_status == 1 && this.item.mode_of_payment == 1) {
            this.primary_button = 'Approve Order';
            this.primary_button_action = 'order_approve';
            this.showAction = true;
          }
          if (this.item.order_status == 1 && this.item.mode_of_payment > 1 && this.item.balance_credit_approved == 0) {
            let label = this.item.mode_of_payment == 2 ? 'Credit' : 'Balance';
            this.primary_button = 'Approve ' + label + ' Request';
            this.primary_button_action = 'payment_approve';
            this.showAction = true;
          }
          if (this.item.order_status == 1 && this.item.mode_of_payment > 1 && this.item.balance_credit_approved == 1) {
            this.primary_button = 'Approve Order';
            this.primary_button_action = 'order_approve';
            this.showAction = true;
          }
          if (this.item.order_status == 2) {
            this.showAction = true;
          }
          if (this.item.order_status == 3 && this.item.prepared_by) {
            /* this.primary_button = 'Update Payment';
            this.primary_button_action = 'update_payment';
            this.showAction = true;
            if (this.item.payment_status == 1) {
              this.showAction = false;
            } */
          }
        }
      }
    }).catch(e => {
      this.isLoaded = true;
      console.log("e", e);
    });
  }
  counter(i: number) {
    return new Array(i);
  }
  openModal(item?, action?): void {
    if (action == 'update_payment') {
      this.route.navigate(['/transactions/update-payment', item.id]);
    } else if (action == 'order_approve' || action == 'payment_approve') {
      let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
        width: '400px',
        data: {
          item: item,
          action: action
        }
      });
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.isLoaded = false;
          this.getRecord();
          this._snackBar.open(result, 'Okay', {
            verticalPosition: 'top',
            announcementMessage: result,
            duration: 3000
          });
        }
      });
    } else if (action == 'order_decline') {
      let dialog = this.dialog.open(GeneralModalComponent, {
        width: '400px',
        data: {
          item: item,
          action: action
        }
      });
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.getRecord();
          this._snackBar.open(result, 'Okay', {
            verticalPosition: 'top',
            announcementMessage: result,
            duration: 3000
          });
        }
      });
    } else if (action == 'order_cancel') {
      let dialog = this.dialog.open(GeneralModalComponent, {
        width: '400px',
        data: {
          item: item,
          action: action
        }
      });
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.getRecord();
          this._snackBar.open(result, 'Okay', {
            verticalPosition: 'top',
            announcementMessage: result,
            duration: 3000
          });
        }
      });
    } else if (action == 'show_stocks') {
      this.dialog.open(FreshEggInventoryModalComponent, {
        width: '600px'
      });
    } else if (action == 'add_discount') {
      let dialog = this.dialog.open(AddDiscountModalComponent, {
        width: '400px',
        data: {
          item: item,
          action: action
        }
      });
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.getRecord();
          this._snackBar.open(result, 'Okay', {
            verticalPosition: 'top',
            announcementMessage: result,
            duration: 3000
          });
        }
      });
    }
  }
  goBack() {
    this.location.back();
  }
  removeTimer(e) {
    console.log("e", e);
    this.display_timer = false;
  }
  async orderList(can_sort, order_by_column, order_by) {
    if (can_sort) {
      this.order = {
        order_by_column: order_by_column,
        order_by: order_by
      };
    }
  }
}
