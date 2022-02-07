import { Component, OnInit } from '@angular/core';
import { datatable } from './../../../../../components/datatables/trays-view/trays-view';
import { limitoptions } from './../../../../../components/datatables/limit/limit';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { InventoryStocksService } from './../../../../../services/inventory-stocks/inventory-stocks.service';
import { GeneralService } from './../../../../../services/general/general.service';
import { ReportTraysViewComponent } from './../../../../../components/modals/reports/report-trays-view/report-trays-view.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-trays-view',
  templateUrl: './trays-view.component.html',
  styleUrls: ['./trays-view.component.scss']
})
export class TraysViewComponent implements OnInit {

  isLoaded: boolean = false;

  ths: any = datatable;
  limits: any = limitoptions;

  visible_columns: any = [];

  id: number;
  items: any = [];
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

  in_house: number = 0;
  out_sales: number = 0;

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
    private _route: ActivatedRoute,
    private dialog: MatDialog,
    private generalService: GeneralService,
    private inventoryStocksService: InventoryStocksService,
    private location: Location
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this.getRecord();
      this.getActivity('trays_view', this.id);
    });
  }
  async getRecord() {
    await this.inventoryStocksService.getTrayRecord(this.id).then(res => {
      this.isLoaded = true;
      console.log(res);
      if (res['error'] == 0) {
        this.items = res['data'];
        this.totalItems = res['total_count']/* res['data']['total_trays'] */;
        this.totalPages = res['total_page'];
        this.prev_page = res['previous_page'];
        this.next_page = res['next_page'];
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
  counter(i: number) {
    return new Array(i);
  }
  goBack() {
    this.location.back();
  }
  async getActivity(page, id) {
    await this.generalService.getActivity(page, null, null, null, id).then(res => {
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
      await this.getRecord();
    }
  }
  openModal() {
    this.btnOps_pdf.active = true;
    let dialog = this.dialog.open(ReportTraysViewComponent, {
      panelClass: "scroll",
      data: {
        id: this.id,
        visible_columns: this.visible_columns,
        ths: this.ths
      }
    });
    dialog.afterClosed().subscribe((result: any) => {
      setTimeout(() => {
        this.btnOps_pdf.active = false;
      }, 1500);
    });
  }
  async exportToCsv() {
    
  }
}
