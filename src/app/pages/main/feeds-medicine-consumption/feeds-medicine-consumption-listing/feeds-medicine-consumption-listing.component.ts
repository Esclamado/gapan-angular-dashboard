import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FeedsMedicineConsumptionService } from './../../../../services/feeds-medicine-consumption/feeds-medicine-consumption.service'
import { AuthService } from './../../../../services/auth/auth.service';
import { Router } from "@angular/router";
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-feeds-medicine-consumption-listing',
  templateUrl: './feeds-medicine-consumption-listing.component.html',
  styleUrls: ['./feeds-medicine-consumption-listing.component.scss']
})
export class FeedsMedicineConsumptionListingComponent implements OnInit {

  isLoaded: boolean = false;
  monthdatetoday: any = new Date();
  page: number = 1;
  limit: number = 10;
  totalItems: number = 0;
  prev_page: number = 0;
  next_page: number = 0;
  totalPages: number = 0;
  limit_disabled: number = 0;
  items: any = [];
  canAdd: boolean = false;
  from: any = null;
  to: any = null;
  created_at: any = [];
  order: any = {
    order_by_column: 'house_id',
    order_by: 'asc'
  };
  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Add new monthly record',
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

  max_date: any = new Date();

  constructor(
    private auth: AuthService,
    private datePipe: DatePipe,
    private router: Router,
    private feedsandmedicineConsumption: FeedsMedicineConsumptionService
  ) {
    
  }

  async ngOnInit() {
    await this.resetDate();
    await this.auth.validateUserRole();
    await this.validate();
    await this.getHouseListing();
  }
  async getHouseListing() {
    await this.feedsandmedicineConsumption.getHouselist(this.page, this.limit, this.from, this.to, this.order).then((res: any) => {
      this.isLoaded = true;
      if (res.error == 0) {
        this.totalItems = res.total_count;
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
      console.log("e", e);
      this.isLoaded = true;
    });
  }
  async validate() {
    this.feedsandmedicineConsumption.validate().then((res: any) => {
      if (res.error == 0) {
        this.canAdd = true;
      } else {
        this.canAdd = false;
      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  counter(i: number) {
    return new Array(i);
  }
  async clearFilters() {
    await this.resetDate();
    this.isLoaded = false;
    this.page = 1;
    this.items = [];
    this.totalItems = 0;
    await this.ngOnInit();
  }
  async gotoPage(page) {
    if (this.page != page) {
      this.isLoaded = false;
      this.page = page.pageIndex + 1;
      this.items = [];
      this.totalItems = 0;
      await this.ngOnInit();
    }
  }
  async resetDate() {
    let dateToday = new Date();
    let year = dateToday.getFullYear();
    let month = dateToday.getMonth();
    this.from = this.datePipe.transform(new Date(year, month, 1), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(year, month + 1, 0), 'yyyy-MM-dd');
    this.max_date = this.to;
    this.created_at = {
      begin: this.from,
      end: this.to
    };
  }
  async chooseCreatedAt(e) {
    console.log("e", e);
    this.from = this.datePipe.transform(new Date(this.created_at.begin), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(this.created_at.end), 'yyyy-MM-dd');
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    await this.ngOnInit();
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
