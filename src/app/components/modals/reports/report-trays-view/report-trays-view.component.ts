import { Component, OnInit, Inject } from '@angular/core';
import { datatable } from './../../../datatables/trays-view/trays-view';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryStocksService } from './../../../../services/inventory-stocks/inventory-stocks.service';
import { DatePipe } from '@angular/common';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

export interface DialogData {
  id: number,
  visible_columns: any,
  ths: any
};

@Component({
  selector: 'app-report-trays-view',
  templateUrl: './report-trays-view.component.html',
  styleUrls: ['./report-trays-view.component.scss']
})
export class ReportTraysViewComponent implements OnInit {
  
  isLoaded: boolean = false;

  ths: any = datatable;

  visible_columns: any = [];
  items: any = [];
  id: number;

  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementId: 'printable-section',
    options: {
      jsPDF: {
        orientation: 'landscape',
        format: 'A4',
      },
      margin: 10,
      compress: true,
      pagebreak: {
        after: '.break-now'
      },
      showall: true,
      pdfCallbackFn: this.pdfCallbackFn
    }
  };

  user_profile: any = [];
  date_today: any = new Date();
  
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
    public dialogRef: MatDialogRef<ReportTraysViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private inventoryStocksService: InventoryStocksService,
    private exportAsService: ExportAsService,
    private datePipe: DatePipe,
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
    this.id = this.data.id;
    this.visible_columns = this.data.visible_columns;
    this.ths = this.data.ths;
    await this.getRecord();
  }
  async getRecord() {
    await this.inventoryStocksService.getTrayRecord(this.id).then((res: any) => {
      this.isLoaded = true;
      if (res.error == 0) {
        this.items = res.data;
      } else {
        this.items = [];
      }
    }).catch(e => {
      this.isLoaded = true;
      console.log("e", e);
    });
  }
  pdfCallbackFn (pdf: any) {
    // example to add page number as footer to every page of pdf
    /* pdf.showall */
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(12);
      pdf.text(i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 25, pdf.internal.pageSize.getHeight() - 10);
    }
  }
}
