import { Component, OnInit } from "@angular/core";
import { datatable } from './../../../../components/datatables/customer-view/customer-view';
import { limitoptions } from './../../../../components/datatables/limit/limit';
import { orderstatus } from './../../../../components/datatables/filter/order-status/order-status';
import { paymentstatus } from '../../../../components/datatables/filter/payment-status/payment-status';
import { modeofpayment } from './../../../../components/datatables/filter/mode-of-payment/mode-of-payment';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { TransactionsService } from './../../../../services/transactions/transactions.service';
import { StaffService } from './../../../../services/staff/staff.service';
import { OrdersService } from './../../../../services/orders/orders.service';
import { Router } from "@angular/router";
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})
export class CustomerViewComponent implements OnInit {

  isLoaded: boolean = false;

  ths: any = datatable;
  limits: any = limitoptions;
  
  visible_columns: any = [];

  order_status_options: any = orderstatus;
  payment_status_options: any = paymentstatus;
  mode_of_payment_options: any = modeofpayment;

  items: any = [];
  totalItems: number = 0;
  
  prev_page: number = 0;
  next_page: number = 0;
  totalPages: number = 0;

  page: number = 1;
  limit: number = 10;
  limit_disabled: number = 0;
  order: any = {
    order_by_column: 'transaction_id',
    order_by: 'asc'
  };
  search: any = '';
  order_status: number = 0;
  payment_status: number = 0;
  mode_of_payment: number = 0;
  from: any = null;
  to: any = null;
  created_at: any = [];
  show_filter: boolean = false;

  user_profile: any = [];

  collectibles: any = [];

  show_password: boolean = false;
  max_date: any = new Date();

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Edit Profile',
    spinnerSize: 19,
    raised: false,
    stroked: true,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    customClass: 'btn btn-secondary btn-block',
    buttonIcon: {
      fontSet: 'fa',
      fontIcon: 'fa-pencil',
      inline: true
    }
  };
  
  constructor(
    private datePipe: DatePipe,
    private staffService: StaffService,
    private location: Location,
    public _route: ActivatedRoute,
    private ordersService: OrdersService,
    private router: Router,
    private transactions: TransactionsService
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  async ngOnInit() {
    await this.resetDate();
    await this._route.params.subscribe((params: any) => {
      this.getRecord(params.id);
      this.getCollectibles(params.id);
    });
  }
  async getRecord(id: number) {
    await this.staffService.getProfile(id).then((res: any) => {
      if (res.error == 0) {
        this.user_profile = res.data;
        this.getOrders();
      } else {

      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  async getCollectibles(user_id: number) {
    await this.ordersService.getCollectibles(user_id).then((res: any) => {
      if (res.error == 0) {
        this.collectibles = res.data;
      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  async getOrders() {
    await this.transactions.getList(this.page, this.limit, this.order, this.user_profile.id, this.order_status, this.payment_status, this.mode_of_payment, this.from, this.to, this.search).then((res: any) => {
      this.isLoaded = true;
      if (res.error == 0) {
        this.totalItems = res.total_count;
        this.totalPages = res.total_page;
        this.prev_page = res.previous_page;
        this.next_page = res.next_page;
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        res.datas.forEach((data: any) => {
          this.items.push(data);
        });
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
  async searchItem() {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getOrders();
  }
  async changeLimit(e: any) {
    this.isLoaded = false;
    this.items = [];
    this.page = 1;
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getOrders();
  }
  async gotoPage(page: any) {
    if (this.page != page) {
      this.isLoaded = false;
      this.page = page.pageIndex + 1;
      this.items = [];
      this.totalItems = 0;
      this.totalPages = 0;
      await this.getOrders();
    }
  }
  async orderList(can_sort: any, order_by_column: any, order_by: any) {
    if (can_sort) {
      this.order = {
        order_by_column: order_by_column,
        order_by: order_by
      };
      this.isLoaded = false;
      this.items = [];
      this.totalItems = 0;
      this.totalPages = 0;
      await this.getOrders();
    }
  }
  async changePaymentStatus(e: any) {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getOrders();
  }
  async changeOrderStatus(e: any) {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getOrders();
  }
  async changeModeOfPayment(e) {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getOrders();
  }
  async chooseCreatedAt(e: any) {
    this.from = this.datePipe.transform(new Date(this.created_at.begin), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(this.created_at.end), 'yyyy-MM-dd');
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getOrders();
  }
  showFilter() {
    this.show_filter = !this.show_filter;
  }
  async clearFilters() {
    await this.resetDate();
    this.isLoaded = false;
    this.page = 1;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;

    this.payment_status = null;
    this.order_status = null;
    this.mode_of_payment = null;

    await this.getOrders();
  }
  async resetDate() {
    this.from = null;
    this.to = null;
    this.created_at = [];
  }
  async changeColumnVisibility(e: any) {
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
  goBack() {
    this.location.back();
  }
  showPassword() {
    this.show_password = !this.show_password;
  }
  async routerLink(page: any, id: number) {
    this.btnOps.active = true;
    this.router.navigate([page, id]).then(() => {
      setTimeout(() => {
        this.btnOps.active = false;
      }, 1500);
    });
  }
}
