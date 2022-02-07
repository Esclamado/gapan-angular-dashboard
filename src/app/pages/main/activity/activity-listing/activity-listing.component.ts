import { Component, OnInit, NgZone } from '@angular/core';
import { datatable } from './../../../../components/datatables/activity-listing/activity-listing';
import { limitoptions } from './../../../../components/datatables/limit/limit';
import { DashboardService } from './../../../../services/dashboard/dashboard.service';
import { AuthService } from './../../../../services/auth/auth.service';

@Component({
  selector: 'app-activity-listing',
  templateUrl: './activity-listing.component.html',
  styleUrls: ['./activity-listing.component.scss']
})
export class ActivityListingComponent implements OnInit {

  isLoaded: boolean = false;

  ths: any = datatable;
  limits: any = limitoptions;

  visible_columns: any = [];
  items: any = [];
  totalItems: number = 0;
  page: number = 1;
  prev_page: number = 0;
  next_page: number = 0;
  totalPages: number = 0;
  limit: number = 10;
  limit_disabled: number = 0;
  order: any = {
    order_by_column: 'created_at',
    order_by: 'desc'
  };
  search: any = '';
  activity: any = [];
  showtimeago: boolean = true;

  constructor(
    private auth: AuthService,
    private dashboardService: DashboardService,
    private _zone: NgZone
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  ngOnInit() {
    this.auth.validateUserRole();
    this.getListing();
  }
  async changeLimit(e) {
    this.isLoaded = false;
    this.items = [];
    this.page = 1;
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getListing();
  }
  async gotoPage(page) {
    this.isLoaded = false;
    this.page = page.pageIndex + 1;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getListing();
  }
  async getListing() {
    this.limit_disabled = this.limit;
    await this.dashboardService.getStaffActivities(this.page, this.limit, null, null, null, null, this.order, this.search).then((res: any) => {
      this._zone.run(() => {
        this.isLoaded = true;
        console.log('staffActivities',res);
        if (res['error'] == 0) {
          this.totalItems = res.total_count;
          this.totalPages = res.total_page;
          this.prev_page = res.previous_page;
          this.next_page = res.next_page;
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
      });
    }).catch(e => {
      this.isLoaded = true;
      console.log("e", e);
    });
  }
  counter(i: number) {
    return new Array(i);
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
      await this.getListing();
    }
  }
  async searchItem() {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getListing();
  }
}
