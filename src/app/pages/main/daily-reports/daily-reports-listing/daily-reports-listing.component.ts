import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { datatable } from './../../../../components/datatables/daily-reports-listing/daily-reports-listing';
import { limitoptions } from './../../../../components/datatables/limit/limit';
import { reportstatus } from './../../../../components/datatables/filter/report-status/report-status';
import { DailyReportsService } from './../../../../services/daily-reports/daily-reports.service';
import { StaffService } from './../../../../services/staff/staff.service';
import { GeneralService } from './../../../../services/general/general.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ReportDailyComponent } from './../../../../components/modals/reports/report-daily/report-daily.component';
import { AuthService } from './../../../../services/auth/auth.service';
import { ExportToCsv } from 'export-to-csv';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-daily-reports-listing',
  templateUrl: './daily-reports-listing.component.html',
  styleUrls: ['./daily-reports-listing.component.scss']
})
export class DailyReportsListingComponent implements OnInit {

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
    order_by: 'desc'
  };
  search: any = '';
  staff_items: any = [];
  flockmanId: number = 0;
  type: number = 0;
  from: any = null;
  to: any = null;
  created_at: any = [];
  report_status: number;
  show_filter: boolean = true;
  activity: any = [];
  showtimeago: boolean = true;
  max_date: any = new Date();
  
  btnOps_pdf: MatProgressButtonOptions = {
    active: false,
    text: 'Download as PDF',
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
      fontIcon: 'fa-download',
      inline: true
    }
  };

  btnOps_csv: MatProgressButtonOptions = {
    active: false,
    text: 'Download as CSV',
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
      fontIcon: 'fa-download',
      inline: true
    }
  };

  constructor(
    private auth: AuthService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    public _route: ActivatedRoute,
    private dailyReportsService: DailyReportsService,
    private generalService: GeneralService,
    private staffService: StaffService
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  async ngOnInit() {
    await this.resetDate();
    await this.auth.validateUserRole();
    await this.getList();
    await this.getStaffList();
    await this.getActivity('daily_reports_listing');
  }
  async getList() {
    await this.dailyReportsService.getList(this.page, this.limit, this.type, this.flockmanId, this.from, this.to, this.order, this.search).then((res: any) => {
      this.isLoaded = true;
      if (res.error == 0) {
        this.totalItems = res.total_count;
        this.totalPages = res.total_page;
        this.prev_page = res.previous_page;
        this.next_page = res.next_page;
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        res.datas.forEach(data => {
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
  async getStaffList() {
    this.staffService.getList(1, 10, null, 8).then(res => {
      console.log("getStaffListing", res);
      if (res['error'] == 0) {
        this.staff_items = res['datas'];
      }
    }).catch(e => {
      console.log("e", e);
    })
  }
  async changeFlockman(e) {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getList();
  }
  async changeReportStatus(e) {
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
    this.flockmanId = 0;
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
  openModal() {
    this.btnOps_pdf.active = true;
    let dialog = this.dialog.open(ReportDailyComponent, {
      /* width: '400px', */
      panelClass: "scroll",
      data: {
        page: 1,
        limit: this.totalItems,
        from: this.from,
        to: this.to,
        visible_columns: this.visible_columns,
        ths: this.ths,
        type: this.type,
        flockmanId: this.flockmanId,
        order: this.order,
        search: this.search,
        all: true
      }
    });
    dialog.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.btnOps_pdf.active = false;
      }, 1500);
    });
  }
  async exportToCsv() {
    this.btnOps_csv.active = true;
    let datas = [];
    await this.dailyReportsService.getList(1, this.totalItems, this.type, this.flockmanId, this.from, this.to, this.order, this.search).then(res => {
      if (res['error'] == 0) {
        res['datas'].forEach(data => {

          let med_intake: any = [];

          if (data.medicine_name) {
            data.medicine_name.forEach(med => {
              med_intake.push(med.medicine);
            });
          }

          med_intake = med_intake.join(', ');

          datas.push({
            'Date and Time': this.datePipe.transform(new Date(data.prepared_by_date), 'yyyy-MM-dd'),
            'House/Building no.': data.house_name.house_name,
            'Age': data.age,
            'Mortality': data.mortality,
            'Mortality Rate %': data.mortality_rate,
            'Cull': data.cull,
            'End Bird Population': data.bird_count,
            'Total Egg Count': data.real_egg_count,
            'Production Rate %': data.production_rate,
            'No. of bags': data.feeds.bags,
            'Feed Consumption': data.feeds.string,
            'Medicine Intake': med_intake,
            'Report Status':  data.sortingRecordstatus ? data.sortingRecordstatus : data.recordStatus,
            'Flockman': data.flockman
          });
        });
        
        const options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalSeparator: '.',
          showLabels: true, 
          showTitle: true,
          title:  'Report-Daily-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          useTextFile: false,
          useBom: true,
          useKeysAsHeaders: true,
          filename: 'Report-Daily-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        };
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(datas);
      } else {

      }
    }).catch(e => {
      console.log("e", e);
    });
    setTimeout(() => {
      this.btnOps_csv.active = false;
    }, 1500);
  }
}
