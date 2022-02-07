import { Component, OnInit } from '@angular/core';
import { datatable } from './../../../../components/datatables/customer-listing/customer-listing';
import { limitoptions } from './../../../../components/datatables/limit/limit';
import { CustomerService } from './../../../../services/customer/customer.service';
import { GeneralService } from './../../../../services/general/general.service';
import { Router } from "@angular/router";
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-customer-listing',
  templateUrl: './customer-listing.component.html',
  styleUrls: ['./customer-listing.component.scss']
})
export class CustomerListingComponent implements OnInit {

  isLoaded: boolean = false;

  ths: any = datatable;
  limits: any = limitoptions;

  visible_columns: any = [];

  items: any = [];
  totalItems: number = 0;
  prev_page: number = 0;
  next_page: number = 0;
  totalPages: number = 0;

  /* get parameters */
  page: number = 1;
  limit: number = 10;
  limit_disabled: number = 0;
  order: any = {
    order_by_column: 'id',
    order_by: 'asc'
  };
  search: any = '';
  /* get parameters */
  activity: any = [];
  showtimeago: boolean = true;

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Add new customer',
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
    private customerService: CustomerService,
    private generalService: GeneralService
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  ngOnInit() {
    this.getList();
    this.getActivity('customer_listing');
  }
  async getList() {
    await this.customerService.getList(this.page, this.limit, this.order, this.search).then(res => {
      console.log("res", res);
      this.isLoaded = true;
      if (res['error'] == 0) {
        this.totalItems = res['total_count']/* res['data']['total_number_of_customers'] */;
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
    this.isLoaded = false;
    this.page = page.pageIndex + 1;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getList();
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
  counter(i: number) {
    return new Array(i);
  }
  async getActivity(page) {
    await this.generalService.getActivity(page).then(res => {
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
