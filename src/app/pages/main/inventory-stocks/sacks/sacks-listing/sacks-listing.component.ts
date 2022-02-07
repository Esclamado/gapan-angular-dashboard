import { Component, OnInit } from '@angular/core';
import { datatable } from './../../../../../components/datatables/sacks-listing/sacks-listing';
import { limitoptions } from './../../../../../components/datatables/limit/limit';
import { InventoryStocksService } from './../../../../../services/inventory-stocks/inventory-stocks.service';
import { GeneralService } from './../../../../../services/general/general.service';
import { DatePipe } from '@angular/common';
import { ExportToCsv } from 'export-to-csv';
import { MatDialog } from '@angular/material/dialog';
import { ReportSacksComponent } from './../../../../../components/modals/reports/report-sacks/report-sacks.component';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-sacks-listing',
  templateUrl: './sacks-listing.component.html',
  styleUrls: ['./sacks-listing.component.scss']
})
export class SacksListingComponent implements OnInit {

  isLoaded: boolean = false;
  show_filter: boolean = false;

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
  from: any = null;
  to: any = null;
  created_at: any = [];
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
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private generalService: GeneralService,
    private inventoryStocksService: InventoryStocksService
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
    this.max_date.setDate(this.max_date.getDate());
  }
  ngOnInit() {
    this.getListing();
    this.getActivity('sacks_listing');
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
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getListing();
  }
  async gotoPage(page) {
    this.isLoaded = false;
    this.page = page.pageIndex + 1;
    this.items = [];
    this.totalItems = 0;
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
    await this.inventoryStocksService.getSackList(this.page, this.limit, this.order, this.from, this.to, this.search).then((res: any) => {
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
          data.total_out_sales = Number(data.total_out) + Number(data.sales);
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
  showFilter() {
    this.show_filter = !this.show_filter;
  }
  counter(i: number) {
    return new Array(i);
  }
  async clearFilters() {
    this.from = null;
    this.to = null;
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getListing();
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
  async chooseCreatedAt(e) {
    /* console.log("e", e);
    console.log("created_at", this.created_at); */
    this.from = this.datePipe.transform(new Date(this.created_at.begin), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(this.created_at.end), 'yyyy-MM-dd');
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getListing();
  }
  openModal() {
    this.btnOps_pdf.active = true;
    let dialog = this.dialog.open(ReportSacksComponent, {
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
    await this.inventoryStocksService.getSackList(1, this.totalItems, this.order, this.from, this.to, this.search).then(res => {
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          datas.push({
            'Dates': this.datePipe.transform(new Date(data.created_at), 'yyyy-MM-dd'),
            'Beginning no. of stocks (pcs)': data.last_data ? data.last_data.last_ending : 0,
            'No. of In/From House (pcs)': data.total_in,
            'No. of Out/Sales (pcs)': data.total_out_sales,
            'Total Remaining Stocks (pcs)': data.last_ending,
            'Warehouseman': data.name
          });
        });
        
        const options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalSeparator: '.',
          showLabels: true, 
          showTitle: true,
          title:  'Sacks-Inventory-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          useTextFile: false,
          useBom: true,
          useKeysAsHeaders: true,
          filename: 'Sacks-Inventory-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd')
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
