import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { datatable } from './../../../../components/datatables/transactions-listing-by-order-status/transactions-listing-by-order-status';
import { limitoptions } from './../../../../components/datatables/limit/limit';
import { paymentstatus } from '../../../../components/datatables/filter/payment-status/payment-status';
import { TransactionsService } from './../../../../services/transactions/transactions.service';
import { GeneralService } from './../../../../services/general/general.service';
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-transactions-listing-by-order-status',
  templateUrl: './transactions-listing-by-order-status.component.html',
  styleUrls: ['./transactions-listing-by-order-status.component.scss']
})
export class TransactionsListingByOrderStatusComponent implements OnInit {

  isLoaded: boolean = false;

  ths: any = datatable;
  limits: any = limitoptions;

  visible_columns: any = [];

  payment_status_options: any = paymentstatus;

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
    order_by: 'desc'
  };
  search: any = '';
  payment_status: number;
  mode_of_payment: number;
  from: any = null;
  to: any = null;
  created_at: any = [];
  show_filter: boolean = true;

  order_status: number = 1;
  order_status_label: any = "Pending Transactions";
  activity: any = [];
  showtimeago: boolean = true;
  max_date: any = new Date();

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Add new transaction',
    spinnerSize: 19,
    raised: false,
    stroked: false,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    customClass: 'btn btn-primary btn-block',
    buttonIcon: {
      fontSet: 'fa',
      fontIcon: 'fa-plus',
      inline: true
    }
  };

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    public _route: ActivatedRoute,
    private generalService: GeneralService,
    private transactions: TransactionsService
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  async ngOnInit() {
    await this.resetDate();
    await this._route.params.subscribe((params: any) => {
      this.order_status = params.status;
      if (this.order_status == 4) {
        this.order_status_label = "Completed Transactions";
      } else {
        this.order_status_label = "Pending Transactions";
      }
      this.clearFilters();
      this.getActivity('transactions_listing', this.order_status);
    });
  }
  async getList() {
    await this.transactions.getList(this.page, this.limit, this.order, null, this.order_status, this.payment_status, this.mode_of_payment, this.from, this.to).then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        this.totalItems = res['total_count'];
        this.totalPages = res['total_page'];
        this.prev_page = res['previous_page'];
        this.next_page = res['next_page'];
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        res['datas'].forEach(data => {
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
    await this.getList();
  }
  async changeLimit(e) {
    this.isLoaded = false;
    this.items = [];
    this.page = 1;
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getList();
  }
  async gotoPage(page) {
    if (this.page != page) {
      this.isLoaded = false;
      this.page = page.pageIndex + 1;
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
  async changePaymentStatus(e) {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getList();
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
    await this.resetDate();
    this.payment_status = null;

    this.isLoaded = false;
    this.page = 1;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;

    await this.getList();
  }
  async resetDate() {
    let dateToday = new Date();
    let year = dateToday.getFullYear();
    let month = dateToday.getMonth();
    this.from = this.datePipe.transform(new Date(year, month, 1), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(dateToday), 'yyyy-MM-dd');
    this.created_at = {
      begin: this.from,
      end: this.to
    };
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
  async getActivity(page, order_status) {
    await this.generalService.getActivity(page, null, order_status).then(res => {
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
  async routerLink(page) {
    this.btnOps.active = true;
    this.router.navigate([page]).then(() => {
      setTimeout(() => {
        this.btnOps.active = false;
      }, 1500);
    });
  }
}
