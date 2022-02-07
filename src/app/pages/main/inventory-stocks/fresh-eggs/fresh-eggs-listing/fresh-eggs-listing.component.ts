import { Component, OnInit } from '@angular/core';
import { datatable } from './../../../../../components/datatables/fresh-eggs-listing/fresh-eggs-listing';
import { limitoptions } from './../../../../../components/datatables/limit/limit';
import { InventoryStocksService } from './../../../../../services/inventory-stocks/inventory-stocks.service';
import { GeneralService } from './../../../../../services/general/general.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ReportFreshEggsComponent } from './../../../../../components/modals/reports/report-fresh-eggs/report-fresh-eggs.component';
import { ExportToCsv } from 'export-to-csv';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-fresh-eggs-listing',
  templateUrl: './fresh-eggs-listing.component.html',
  styleUrls: ['./fresh-eggs-listing.component.scss']
})
export class FreshEggsListingComponent implements OnInit {

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
    order_by: 'asc'
  };
  search: any = '';
  from: any = null;
  to: any = null;
  created_at: any = [];
  activity: any = [];
  showtimeago: boolean = true;
  total_quantity_of_eggs: number = 0;
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
  }

  async ngOnInit() {
    await this.resetDate();
    await this.getListing();
    await this.getActivity('fresh_egg_inventory_listing');
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
    await this.inventoryStocksService.getEggList(this.page, this.limit, this.order, this.from, this.to, this.search).then((res: any) => {
      this.isLoaded = true;
      if (res.error == 0) {
        this.total_quantity_of_eggs = res.data.total_quantity_of_eggs;
        this.totalItems = res.total_count;
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        res.datas.forEach(data => {
          data.date = this.datePipe.transform(new Date(data.created_at), 'yyyy-MM-dd');
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
    let dialog = this.dialog.open(ReportFreshEggsComponent, {
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
        ths: this.ths,
        total_quantity_of_eggs: this.total_quantity_of_eggs
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
    await this.inventoryStocksService.getEggList(1, this.totalItems, this.order, this.from, this.to, this.search).then(res => {
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          datas.push({
            'Dates': this.datePipe.transform(new Date(data.created_at), 'yyyy-MM-dd'),
            'Beginning no. of stocks': data.beginning_stocks,
            'Total Harvested': data.total_harvested,
            'No. of Waste/Sales': data.waste_sales,
            'Total Remaining Stocks': data.total_remaining_stocks
          });
        });
        
        const options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalSeparator: '.',
          showLabels: true, 
          showTitle: true,
          title:  'Fresh-Eggs-Inventory-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          useTextFile: false,
          useBom: true,
          useKeysAsHeaders: true,
          filename: 'Fresh-Eggs-Inventory-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd')
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
