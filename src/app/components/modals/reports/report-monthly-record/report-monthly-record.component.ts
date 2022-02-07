import { Component, OnInit, Inject } from '@angular/core';
import { datatable } from './../../../datatables/feeds-medicine-consumption-view/feeds-medicine-consumption-view';
import { InventoryStocksService } from './../../../../services/inventory-stocks/inventory-stocks.service';
import { DatePipe } from '@angular/common';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

export interface DialogData {
  visible_columns: number,
  ths: any,
  house_id: any,
  order: any,
  house_data: any,
  feeds_and_medicine: any
};

@Component({
  selector: 'app-report-monthly-record',
  templateUrl: './report-monthly-record.component.html',
  styleUrls: ['./report-monthly-record.component.scss']
})
export class ReportMonthlyRecordComponent implements OnInit {
  
  visible_columns: any = [];
  ths: any = datatable;
  house_id: any;
  order: any = {
    order_by_column: 'created_at',
    order_by: 'asc'
  };
  house_data: any = [];
  feeds_and_medicine: any = [];
  
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementId: 'printable-section',
    options: {
      jsPDF: {
        orientation: 'landscape',
        format: 'legal',
      },
      margin: 10,
      compress: true,
      pagebreak: {
        after: '.break-now'
      },
    }
  };
  user_profile: any = [];
  date_today: any = new Date();
  isLoaded: boolean = false;

  btnOps: MatProgressButtonOptions = {
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

  constructor(
    public dialogRef: MatDialogRef<ReportMonthlyRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private datePipe: DatePipe,
    private inventoryStocksService: InventoryStocksService,
    private exportAsService: ExportAsService,
    private spinner: NgxSpinnerService
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    let user = await JSON.parse(localStorage.getItem("user"));
    this.user_profile = user;
    this.visible_columns = this.data.visible_columns;
    this.ths = this.data.ths;
    this.house_id = this.data.house_id;
    this.order = this.data.order;
    this.house_data = this.data.house_data;
    this.feeds_and_medicine = this.data.feeds_and_medicine;
    this.isLoaded = true;
    await this.spinner.hide();
  }
  async exportPdf(type: SupportedExtensions, opt?: string) {
    this.btnOps.active = true;
    this.exportAsConfig.type = type;
    if (opt) {
      this.exportAsConfig.options.jsPDF.orientation = opt;
    }
    let fileName = 'Feeds-And-Medicine-Consumption-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
      setTimeout(() => {
        this.btnOps.active = false;
        this.dialogRef.close();
      }, 1500);
    });
  }
  counter(i: number) {
    return new Array(i);
  }
}
