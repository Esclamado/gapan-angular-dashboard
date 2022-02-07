import { Component, OnInit } from "@angular/core";
import { datatable, datatable2 } from './../../../../components/datatables/payments/payments';
import { GeneralService } from './../../../../services/general/general.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentService } from './../../../../services/payment/payment.service';
import { EventsService } from 'angular4-events';
import { ViewPaymentModalComponent } from './../../../../components/modals/view-payment-modal/view-payment-modal.component';
import { Location } from '@angular/common';
import { ConfirmPasswordModalComponent } from './../../../../components/modals/confirm-password-modal/confirm-password-modal.component';

@Component({
  selector: 'app-payment-listing',
  templateUrl: './payment-listing.component.html',
  styleUrls: ['./payment-listing.component.scss']
})
export class PaymentListingComponent implements OnInit {

  items: any = [];
  item: any = [];
  order_id: number;
  
  ths: any = datatable;
  
  visible_columns: any = [];
  visible_columns_others: any = [];

  isLoaded: boolean = false;

  totalItems: number = 0;
  
  prev_page: number = 0;
  next_page: number = 0;
  totalPages: number = 0;

  page: number = 1;
  limit: number = 10;
  limit_disabled: number = 0;
  order: any = {
    order_by_column: 'updated_at',
    order_by: 'desc'
  };
  search: any = '';
  type: number = 0;
  from: any = null;
  to: any = null;
  created_at: any = [];
  show_filter: boolean = false;
  activity: any = [];
  showtimeago: boolean = false;
  max_date: any = new Date();

  ths_others: any = datatable2;
  items_others: any = [];

  constructor(
    public _route: ActivatedRoute,
    private generalService: GeneralService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private events: EventsService,
    private paymentService: PaymentService,
    private location: Location
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
    this.ths_others.forEach((data, index) => {
      this.visible_columns_others.push(index);
    });
    this.events.subscribe('attachments_refresh', (res?) => {
      if (res) {
        this.isLoaded = false;
        this.page = 1;
        this.items = [];
        this.items_others = [];
        this.totalItems = 0;
        this.totalPages = 0;
        this.ngOnInit();
      }
    });
  }
  async ngOnInit() {
    await this.resetDate();
    await this._route.params.subscribe((params: any) => {
      this.order_id = params.id;
      this.getList();
      this.getListOthers();
      /* this.getActivity('payment_attachment_listing'); */
    });
  }
  async getListOthers() {
    await this.paymentService.getListByOrderId(this.page, this.limit, this.order_id, this.type, this.from, this.to, this.order, this.search).then(res => {
      console.log("getListOthers", res);
      if (res['error'] == 0) {
        this.items_others = res['datas'];
      } else {
        this.items_others = [];
      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  async getList() {
    await this.paymentService.getListByOrderId(this.page, this.limit, this.order_id, 1, this.from, this.to, this.order, this.search).then(res => {
      this.isLoaded = true;
      console.log("getList", res);
      if (res['error'] == 0) {
        this.totalItems = res['total_count'];
        this.totalPages = res['total_page'];
        this.prev_page = res['previous_page'];
        this.next_page = res['next_page'];
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        this.item = res['data'];
        res['datas'].forEach(data => {
          this.items.push(data);
        });
        this.getActivity('payment_attachment_listing');
      } else {
        this.items = [];
        this.totalItems = 0;
        this.totalPages = 0;
      }
    }).catch(e => {
      this.isLoaded = true;
      console.log("e", e);
    });
  }
  async getActivity(page) {
    await this.generalService.getActivity(page, null, null, null, this.item.payment_id).then(res => {
      console.log("resres", res);
      if (res['error'] == 0) {
        this.showtimeago = true;
        this.activity = res['data'];
      } else {
        this.showtimeago = false;
      }
    }).catch(e => {
      console.log(e);
      this.showtimeago = false;
    });
  }
  async searchItem() {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getList();
  }
  async changeLimit(e) {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getList();
  }
  async gotoPage(page) {
    if (this.page != page) {
      this.isLoaded = false;
      this.page = page;
      this.items = [];
      this.totalItems = 0;
      this.totalPages = 0;
      await this.getList();
    }
  }
  async orderList(can_sort, order_by_column, order_by) {
    if (can_sort) {
      this.order = {
        order_by_column: order_by_column,
        order_by: order_by
      };
      this.isLoaded = false;
      this.items = [];
      this.totalItems = 0;
      this.totalPages = 0;
      await this.getList();
    }
  }
  async chooseCreatedAt(e) {
    /* console.log("e", e);
    console.log("created_at", this.created_at); */
    this.from = this.datePipe.transform(new Date(this.created_at.begin), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(this.created_at.end), 'yyyy-MM-dd');
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getList();
  }
  showFilter() {
    this.show_filter = !this.show_filter;
  }
  async clearFilters() {
    this.type = 0;
    await this.resetDate();
    this.isLoaded = false;
    this.page = 1;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;

    await this.getList();
  }
  async resetDate() {
    this.from = null;
    this.to = null;
    this.created_at = [];
  }
  async changeColumnVisibility(e) {
    this.ths.forEach((data, index) => {
      data.isVisible = this.visible_columns.some(e => e == index);
    });
    if (this.visible_columns.length == 1) {
      let i = this.ths.length - 1;
      this.ths[i].isVisible = false;
    } else {
      let i = this.ths.length - 1;
      this.ths[i].isVisible = true;
    }
  }
  counter(i: number) {
    return new Array(i);
  }
  openModal(item?, action?): void {
    if (action == 'attachment_delete') {
      let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
        width: '400px',
        data: {
          item: item ? item : null,
          action: action ? action : null,
          payment_id: this.item.payment.id
        }
      });
      dialog.afterClosed().subscribe(result => {
        if (result) {
          /* this.reloadData(); */
          this._snackBar.open(result, 'Okay', {
            verticalPosition: 'top',
            announcementMessage: result,
            duration: 3000
          });
        }
      });
    } else {
      let dialog = this.dialog.open(ViewPaymentModalComponent, {
        width: '400px',
        data: {
          item: item ? item : null,
          action: action ? action : null,
          payment_id: this.item.payment.id
        }
      });
      dialog.afterClosed().subscribe(result => {
        if (result) {
          /* this.reloadData(); */
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
}