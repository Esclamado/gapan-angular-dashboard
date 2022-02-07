import { Component, OnInit } from '@angular/core';
import { datatable } from './../../../../../components/datatables/fresh-eggs-view/fresh-eggs-view';
import { limitoptions } from './../../../../../components/datatables/limit/limit';
import { ActivatedRoute, Router } from "@angular/router";
import { InventoryStocksService } from './../../../../../services/inventory-stocks/inventory-stocks.service';
import { Location } from '@angular/common';
import { GeneralService } from './../../../../../services/general/general.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ReportFreshEggsViewComponent } from './../../../../../components/modals/reports/report-fresh-eggs-view/report-fresh-eggs-view.component';
import { ExportToCsv } from 'export-to-csv';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-fresh-eggs-view',
  templateUrl: './fresh-eggs-view.component.html',
  styleUrls: ['./fresh-eggs-view.component.scss']
})
export class FreshEggsViewComponent implements OnInit {

  isLoaded: boolean = false;

  ths: any = datatable;
  limits: any = limitoptions;

  visible_columns: any = [];

  date: any = new Date();
  dateToday: Date = new Date();
  items: any = [];
  item: any = [];
  totalItems: number = 0;
  page: number = 1;
  prev_page: number = 0;
  next_page: number = 0;
  totalPages: number = 0;
  limit: number = 10;
  order: any = {
    order_by_column: 'id',
    order_by: 'asc'
  };
  activity: any = [];
  showtimeago: boolean = true;

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
    private _route: ActivatedRoute,
    private generalService: GeneralService,
    private inventoryStocksService: InventoryStocksService,
    private location: Location,
    private datePipe: DatePipe
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  async ngOnInit() {
    this._route.params.subscribe((params: any) => {
      this.date = params.date;
      this.getRecord();
      this.getActivity('fresh_egg_inventory_view', this.date);
    });
  }
  async getRecord() {
    await this.inventoryStocksService.getEggRecord(this.date).then(res => {
      console.log('freshEggsinventory', res);
      this.isLoaded = true;
      if (res['error'] == 0) {
        this.item = res['data'];
        /* this.items = res['datas']; */
        res['datas'].forEach(data => {
          data.remaining = (Number(data.beginning) + Number(data.harvested)) - Number(data.sales);
          this.items.push(data);
        });
      } else {
        this.item = [];
      }
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
      this.getRecord();
    }
  }
  async getActivity(page, date) {
    await this.generalService.getActivity(page, null, null, null, null, date).then(res => {
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
    let dialog = this.dialog.open(ReportFreshEggsViewComponent, {
      /* width: '400px', */
      panelClass: "scroll",
      data: {
        item: this.item,
        items: this.items,
        ths: this.ths,
        visible_columns: this.visible_columns
      }
    });
    dialog.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.btnOps_pdf.active = false;
      }, 1500);
    });
  }
  goBack() {
    this.location.back();
  }
  async exportToCsv() {
    this.btnOps_csv.active = true;
    let datas = [];
    this.items.forEach(data => {
      datas.push({
        'Item Details': data.egg_type.type,
        'Status': data.remaining > 0 ? 'Available' : 'Out of Stock',
        'Beginning no.': data.beginning,
        'Harvested': data.harvested,
        'Sales': data.sales,
        'Remaining Stocks': data.remaining
      });
    });
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title:  'Fresh-Eggs-Inventory-View-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename: 'Fresh-Eggs-Inventory-View-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(datas);
    setTimeout(() => {
      this.btnOps_csv.active = false;
    }, 1500);
  }
}
