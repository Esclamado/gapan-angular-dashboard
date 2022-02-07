import { Component, OnInit } from '@angular/core';
import { datatable } from './../../../../components/datatables/price-management-listing/price-management-listing';
import { limitoptions } from './../../../../components/datatables/limit/limit';
import { PriceManagementService } from './../../../../services/price-management/price-management.service';
import { GeneralService } from './../../../../services/general/general.service';
import { EggTypeService } from './../../../../services/egg-type/egg-type.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PriceModalComponent } from './../../../../components/modals/price-modal/price-modal.component';
import { EventsService } from 'angular4-events';
import { ReportEggPriceComponent } from './../../../../components/modals/reports/report-egg-price/report-egg-price.component';
import { AuthService } from './../../../../services/auth/auth.service';
import { ExportToCsv } from 'export-to-csv';
import { AddEggModalComponent } from './../../../../components/modals/add-egg-modal/add-egg-modal.component';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-price-management-listing',
  templateUrl: './price-management-listing.component.html',
  styleUrls: ['./price-management-listing.component.scss']
})
export class PriceManagementListingComponent implements OnInit {
  isLoaded: boolean = false;

  ths: any = datatable;
  limits: any = limitoptions;

  egg_type_options: any = [];

  visible_columns: any = [];

  items: any = [];
  totalItems: number = 0;
  totalPages: number = 0;

  page: number = 1;
  limit: number = 10;
  limit_disabled: number = 0;
  order: any = {
    order_by_column: 'type',
    order_by: 'asc'
  };
  search: any = '';
  staff_items: any = [];
  type: number = 0;
  from: any = null;
  to: any = null;
  created_at: any = [];
  report_status: number;
  show_filter: boolean = false;
  activity: any = [];
  showtimeago: boolean = true;
  max_date: any = new Date();

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Add new egg',
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
    private dialog: MatDialog,
    private events: EventsService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private eggTypeService: EggTypeService,
    private generalService: GeneralService,
    private priceManagementService: PriceManagementService
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
    this.events.subscribe('price_refresh', (res?) => {
      if (res) {
        this.isLoaded = false;
        this.items = [];
        this.totalItems = 0;
        this.totalPages = 0;
        this.ngOnInit();
      }
    });
  }

  async ngOnInit() {
    await this.resetDate();
    await this.auth.validateUserRole();
    await this.getList();
    await this.getEggTypeList();
    await this.getActivity('price_management_listing');
  }
  async getList() {
    await this.priceManagementService.getList(this.page, this.limit, this.type, this.from, this.to, this.order, this.search).then((res: any) => {
      this.isLoaded = true;
      if (res.error == 0) {
        this.totalItems = res.total_count;
        this.totalPages = res.total_page;
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        res.datas.forEach((data: any) => {
          data.per_piece = Number(data.price);
          data.per_case = 360 * Number(data.price);
          data.per_tray = 30 * Number(data.price);
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
  async getEggTypeList() {
    await this.eggTypeService.getList().then(res => {
      if (res['error'] == 0) {
        this.egg_type_options = res['datas'];
      } else {

      }
    }).catch(e => {
      console.log(e);
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
  async changeType(e) {
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
    this.max_date = new Date();
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
  async reloadData() {
    this.isLoaded = false;
    this.items = [];
    await this.getList();
  }
  counter(i: number) {
    return new Array(i);
  }
  openModal(item?, action?): void {
    let dialog = this.dialog.open(PriceModalComponent, {
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
    });
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
  downloadModal() {
    this.btnOps_pdf.active = true;
    let dialog = this.dialog.open(ReportEggPriceComponent, {
      /* width: '400px', */
      panelClass: "scroll",
      data: {
        page: 1,
        limit: this.totalItems,
        from: this.from,
        to: this.to,
        order: this.order,
        search: this.search,
        visible_columns: this.visible_columns,
        ths: this.ths
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
    await this.priceManagementService.getList(1, this.totalItems, this.type, this.from, this.to, this.order, this.search).then(res => {
      if (res['error'] == 0) {
        res['datas'].forEach(data => {

          data.per_piece = Number(data.price);
          data.per_case = 360 * Number(data.price);
          data.per_tray = 30 * Number(data.price);

          datas.push({
            'Egg Size': data.egg_type_type,
            'Price Per Piece': data.per_piece,
            'Price Per Tray': data.per_tray,
            'Price Per Case': data.per_case,
            'Pricing Effective Date': this.datePipe.transform(new Date(data.updated_at), 'yyyy-MM-dd'),
          });
        });
        
        const options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalSeparator: '.',
          showLabels: true, 
          showTitle: true,
          title:  'Report-Egg-Price-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          useTextFile: false,
          useBom: true,
          useKeysAsHeaders: true,
          filename: 'Report-Egg-Price-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd')
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
  async newEgg() {
    this.btnOps.active = true;
    let dialog = this.dialog.open(AddEggModalComponent, {
      width: '400px',
      data: {
        action: 'create'
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
