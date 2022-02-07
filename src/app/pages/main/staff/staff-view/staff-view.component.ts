import { Component, OnInit } from '@angular/core';
import { datatable } from './../../../../components/datatables/staff-view/staff-view';
import { limitoptions } from './../../../../components/datatables/limit/limit';
import { reportstatus } from './../../../../components/datatables/filter/report-status/report-status';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { StaffService } from './../../../../services/staff/staff.service';
import { DailyReportsService } from './../../../../services/daily-reports/daily-reports.service';
import { DashboardService } from './../../../../services/dashboard/dashboard.service';
import { Options } from 'selenium-webdriver/opera';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPasswordModalComponent } from './../../../../components/modals/confirm-password-modal/confirm-password-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './../../../../services/auth/auth.service';
import { Router } from "@angular/router";
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-staff-view',
  templateUrl: './staff-view.component.html',
  styleUrls: ['./staff-view.component.scss']
})
export class StaffViewComponent implements OnInit {

  isLoaded: boolean = false;

  ths: any = datatable;
  limits: any = limitoptions;
  
  visible_columns: any = [];

  report_status_options: any = reportstatus;

  items: any = [];
  totalItems: number = 0;
  
  prev_page: number = 0;
  next_page: number = 0;
  totalPages: number = 0;

  page: number = 1;
  limit: number = 10;
  limit_disabled: number = 0;
  order: any = {
    order_by_column: 'created_at',
    order_by: 'asc'
  };
  search: any = '';
  report_status: number;
  from: any = null;
  to: any = null;
  created_at: any = [];
  show_filter: boolean = false;
  max_date: any = new Date();

  user_profile: any = [];

  code_options: any = [];
  code: any;

  show_password: boolean = false;

  user_logged_in: any = [];
  user_info: any = [];

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

  btnOps_delete: MatProgressButtonOptions = {
    active: false,
    text: 'Yes, I understand - delete user',
    spinnerSize: 19,
    raised: false,
    stroked: true,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    customClass: 'btn btn-danger btn-block',
  };

  constructor(
    private auth: AuthService,
    private datePipe: DatePipe,
    private dailyReportsService: DailyReportsService,
    private staffService: StaffService,
    private location: Location,
    public _route: ActivatedRoute,
    public dashboardService: DashboardService,
    private dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
    this.user_logged_in = JSON.parse(localStorage.getItem("user"));
  }

  async ngOnInit() {
    await this.resetDate();
    await this.auth.validateUserRole();
    await this._route.params.subscribe((params: any) => {
      this.getRecord(params.id);
    });
  }
  async getRecord(id) {
    await this.staffService.getProfile(id).then(res => {
      if (res['error'] == 0) {
        this.user_profile = res['data'];
        /* this.getList(); */
        this.getListing();
        this.getCodefilter();
      } else {

      }
    }).catch(e => {
      console.log("e", e);
    });
  }
/*   async getList() {
    await this.dailyReportsService.getList(this.page, this.limit, this.report_status, this.user_profile.id, this.from, this.to, this.order, this.search).then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        this.totalItems = res['total_count'];
        this.totalPages = res['total_page'];
        this.prev_page = res['previous_page'];
        this.next_page = res['next_page'];
        if (this.totalItems < 10) {
          this.limit = this.totalItems;
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
  } */
  async searchItem() {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    this.getListing();
    /* await this.getList(); */
  }
  async changeLimit(e) {
    this.isLoaded = false;
    this.items = [];
    this.page = 1;
    this.totalItems = 0;
    this.totalPages = 0;
    this.getListing();
    /* await this.getList(); */
  }
  async gotoPage(page) {
    if (this.page != page) {
      this.isLoaded = false;
      this.page = page.pageIndex + 1;
      this.items = [];
      this.totalItems = 0;
      this.totalPages = 0;
      this.getListing();
      /* await this.getList(); */
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
      this.getListing();
      /* await this.getList(); */
    }
  }
/*   async changePaymentStatus(e) {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getList();
  } */
  async chooseCreatedAt(e) {
    /* console.log("e", e);
    console.log("created_at", this.created_at); */
    this.from = this.datePipe.transform(new Date(this.created_at.begin), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(this.created_at.end), 'yyyy-MM-dd');
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    this.getListing();
    /* await this.getList(); */
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
    this.report_status = null;
    this.code = null;
    this.getListing();
    /* await this.getList(); */
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
  goBack() {
    this.location.back();
  }
  async getListing() {
    await this.dashboardService.getStaffActivities(this.page, this.limit, this.user_profile.id, this.from, this.to, this.code, this.order).then(res => {
      this.isLoaded = true;
      console.log('staffActivities', res);
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
  async getCodefilter(){
    await this.dashboardService.getCode(this.user_profile.user_role_id).then(res => {
      console.log('code', res);
      if(res['error'] == 0){
        this.code_options = res['datas'];
        console.log('codeoptions', this.code_options);
      }
    });
  }
  async changeCode(e){
      this.isLoaded = false;
      this.items = [];
      this.totalItems = 0;
      this.totalPages = 0;
      await this.getListing();
  }
  showPassword() {
    this.show_password = !this.show_password;
  }
  openModal(item, action): void {
    this.btnOps_delete.active = action == 'user_delete' ? true : false;
    let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
      width: '400px',
      data: {
        item: item ? item : null,
        action: action
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.location.back();
        this._snackBar.open(result, 'Okay', {
          verticalPosition: 'top',
          announcementMessage: result,
          duration: 3000
        });
      }
      setTimeout(() => {
        this.btnOps_delete.active = false;
      }, 1500);
    });
  }
  async routerLink(page, id) {
    this.btnOps.active = true;
    this.router.navigate([page, id]).then(() => {
      setTimeout(() => {
        this.btnOps.active = false;
      }, 1500);
    });
  }
}
