import { Component, OnInit } from '@angular/core';
import { datatable } from './../../../../../components/datatables/feeds-listing/feeds-listing';
import { limitoptions } from './../../../../../components/datatables/limit/limit';
import { FeedsMedicineManagementService } from './../../../../../services/feeds-medicine-management/feeds-medicine-management.service';
import { GeneralService } from './../../../../../services/general/general.service';
import { DatePipe } from '@angular/common';
import { AuthService } from './../../../../../services/auth/auth.service';
import { FeedsMedicineManagementUpdateModalComponent } from './../../../../../components/modals/feeds-medicine-management-update-modal/feeds-medicine-management-update-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { Router } from "@angular/router";

@Component({
  selector: 'app-feeds-listing',
  templateUrl: './feeds-listing.component.html',
  styleUrls: ['./feeds-listing.component.scss']
})
export class FeedsListingComponent implements OnInit {

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
  delivery_date: any;
  feed: any;
  expiration_date: any;
  order: any = {
    order_by_column: 'feed',
    order_by: 'asc'
  };
  search: any = '';

  show_filter: boolean = false;

  activity: any = [];
  showtimeago: boolean = true;

  current_date: any = new Date();

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Add new feed',
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
    private auth: AuthService,
    private datePipe: DatePipe,
    private router: Router,
    private feedsMedicineManagementService: FeedsMedicineManagementService,
    private generalService: GeneralService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  ngOnInit() {
    this.auth.validateUserRole();
    this.getList();
    this.getActivity('feeds_listing');
  }
  async getList() {
    await this.feedsMedicineManagementService.getFeedsList(this.page, this.limit, this.delivery_date, this.feed, this.expiration_date, this.order, this.search).then((res: any) => {
      this.isLoaded = true;
      if (res.error == 0) {
        this.totalItems = res.data.feed_count;
        this.totalPages = res.total_page;
        this.prev_page = res.previous_page;
        this.next_page = res.next_page;
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        res.datas.forEach(data => {
          data.converted = Number(data.kg_per_bag) * 1000;
          data.remaining_pieces = (Number(data.remaining) / 1000) / Number(data.kg_per_bag);
          data.isExpired = this.datePipe.transform(new Date(this.current_date), 'yyyy-MM-dd') >= this.datePipe.transform(new Date(data.expiration_date), 'yyyy-MM-dd') ? true : false;
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
  async changeLimit(limit) {
    this.isLoaded = false;
    /* this.limit = limit.target.value; */
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
  async chooseDeliveryDate(e) {
    this.delivery_date = this.datePipe.transform(new Date(e.value), 'yyyy-MM-dd');
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getList();
  }
  async chooseExpirationDate(e) {
    this.expiration_date = this.datePipe.transform(new Date(e.value), 'yyyy-MM-dd');
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
    this.isLoaded = false;
    this.page = 1;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    this.delivery_date = null;
    this.expiration_date = null;
    await this.getList();
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
  openModal(item?, action?, type?): void {
    let dialog = this.dialog.open(FeedsMedicineManagementUpdateModalComponent, {
      width: '400px',
      data: {
        item: item ? item : null,
        action: action,
        type: type
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.reloadData();
        this._snackBar.open(result, 'Okay', {
          verticalPosition: 'top',
          announcementMessage: result,
          duration: 3000
        });
      }
    });
  }
  async reloadData() {
    this.isLoaded = false;
    this.items = [];
    await this.getList();
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
