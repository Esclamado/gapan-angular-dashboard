import { Component, OnInit } from "@angular/core";
import { datatable } from './../../../../components/datatables/house-listing/house-listing';
import { limitoptions } from './../../../../components/datatables/limit/limit';
import { HouseService } from './../../../../services/house/house.service';
import { GeneralService } from './../../../../services/general/general.service';
import { HouseModalComponent } from './../../../../components/modals/house-modal/house-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './../../../../services/auth/auth.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-house-listing',
  templateUrl: './house-listing.component.html',
  styleUrls: ['./house-listing.component.scss']
})
export class HouseListingComponent implements OnInit {

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
    order_by_column: 'house_name',
    order_by: 'asc'
  };
  search: any = '';

  activity: any = [];
  showtimeago: boolean = true;

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Add new house/building',
    spinnerSize: 19,
    raised: false,
    stroked: false,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    customClass: 'btn btn-primary btn-block mb-20',
    buttonIcon: {
      fontSet: 'fa',
      fontIcon: 'fa-plus',
      inline: true
    }
  };

  constructor(
    private auth: AuthService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private generalService: GeneralService,
    private houseService: HouseService
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }
  ngOnInit() {
    this.auth.validateUserRole();
    this.getListing();
    this.getActivity('house_listing');
  }
  async searchItem() {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getListing();
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
  async getListing() {
    await this.houseService.getList(this.page, this.limit, this.order, this.search).then(res => {
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
  async reloadData() {
    this.isLoaded = false;
    this.items = [];
    await this.getListing();
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
  openModal(item?, action?): void {
    this.btnOps.active = !action ? true : false;
    let dialog = this.dialog.open(HouseModalComponent, {
      width: '400px',
      data: {
        item: item ? item : null,
        action: action ? action : 'create'
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
      setTimeout(() => {
        this.btnOps.active = false;
      }, 1500);
    });
  }
}
