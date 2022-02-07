import { Component, OnInit } from '@angular/core';
import { datatable } from './../../../../../components/datatables/trays-listing/trays-listing';
import { limitoptions } from './../../../../../components/datatables/limit/limit';
import { InventoryStocksService } from './../../../../../services/inventory-stocks/inventory-stocks.service';
import { GeneralService } from './../../../../../services/general/general.service';
import { DatePipe } from '@angular/common';
import { ExportToCsv } from 'export-to-csv';
import { MatDialog } from '@angular/material/dialog';

import { ReportTraysComponent } from './../../../../../components/modals/reports/report-trays/report-trays.component';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-trays-listing',
  templateUrl: './trays-listing.component.html',
  styleUrls: ['./trays-listing.component.scss']
})
export class TraysListingComponent implements OnInit {

  isLoaded: boolean = false;
  show_filter: boolean = false;

  ths: any = datatable;
  limits: any = limitoptions;

  visible_columns: any = [];
  
  items: any = [];
  totalItems: number = 0;
  page: number = 1;
  limit: number = 10;
  limit_disabled: number = 0;
  order: any = {
    order_by_column: 'created_at',
    order_by: 'desc'
  };
  search: any = '';
  from: any = null;
  to: any = null;
  created_at: any = [];
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
    customClass: 'btn btn-primary btn-block mb-20',
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
    customClass: 'btn btn-primary btn-block mb-20',
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

  async ngOnInit() {
    await this.resetDate();
    await this.getListing();
    await this.getActivity('trays_listing');
  }
  async searchItem() {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    await this.getListing();
  }
  async changeLimit(e) {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
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
      await this.getListing();
    }
  }
  async getListing() {
    await this.inventoryStocksService.getTrayList(this.page, this.limit, this.order, this.from, this.to, this.search).then((res: any) => {
      this.isLoaded = true;
      if (res.error == 0) {
        this.totalItems = res.total_count;
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        res.datas.forEach(data => {
          this.items.push(data);
        });
      } else {
        this.items = [];
        this.totalItems = 0;
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
  async chooseCreatedAt(e) {
    /* console.log("e", e);
    console.log("created_at", this.created_at); */
    this.from = this.datePipe.transform(new Date(this.created_at.begin), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(this.created_at.end), 'yyyy-MM-dd');
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    await this.getListing();
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

    await this.getListing();
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
    let dialog = this.dialog.open(ReportTraysComponent, {
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
    await this.inventoryStocksService.getTrayList(1, this.totalItems, this.order, this.from, this.to, this.search).then(res => {
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          datas.push({
            'Time and Date': this.datePipe.transform(new Date(data.created_at), 'yyyy-MM-dd'),
            'Beginning no. of stocks (pcs)': data.beginning,
            'In/Return of Stocks (pcs)': data.returned,
            'No. of Out/Sales (pcs)': data.number_of_out_sales,
            'Total Remaining Stocks (pcs)': data.total_remaining,
            'Warehouseman': data.name
          });
        });
        
        const options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalSeparator: '.',
          showLabels: true, 
          showTitle: true,
          title:  'Tray-Inventory-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          useTextFile: false,
          useBom: true,
          useKeysAsHeaders: true,
          filename: 'Tray-Inventory-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd')
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