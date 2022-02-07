import { Component, OnInit, Inject } from '@angular/core';
import { datatable } from './../../../datatables/fresh-eggs-listing/fresh-eggs-listing';
import { InventoryStocksService } from './../../../../services/inventory-stocks/inventory-stocks.service';
import { DatePipe } from '@angular/common';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

export interface DialogData {
  page: number,
  limit: number,
  from: any,
  to: any,
  order: any,
  search: any,
  visible_columns: any,
  ths: any,
  total_quantity_of_eggs: number
};

@Component({
  selector: 'app-report-fresh-eggs',
  templateUrl: './report-fresh-eggs.component.html',
  styleUrls: ['./report-fresh-eggs.component.scss']
})
export class ReportFreshEggsComponent implements OnInit {

  isLoaded: boolean = false;

  ths: any = datatable;

  visible_columns: any = [];
  items: any = [];
  page: number = 1;
  limit: number = 10;
  order: any = {
    order_by_column: 'created_at',
    order_by: 'asc'
  };
  search: any = '';
  from: any = null;
  to: any = null;
  created_at: any = [];

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
  total_quantity_of_eggs: number

  constructor(
    public dialogRef: MatDialogRef<ReportFreshEggsComponent>,
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
    this.page = this.data.page;
    this.limit = this.data.limit;
    this.from = this.data.from;
    this.to = this.data.to;
    this.visible_columns = this.data.visible_columns;
    this.ths = this.data.ths;
    this.total_quantity_of_eggs = this.data.total_quantity_of_eggs;
    await this.getListing();
  }
  async getListing() {
    await this.inventoryStocksService.getEggList(this.page, this.limit, this.order, this.from, this.to, this.search).then((res: any) => {
      this.isLoaded = true;
      if (res.error == 0) {
        res.datas.forEach(data => {
          data.date = this.datePipe.transform(new Date(data.created_at), 'yyyy-MM-dd');
          this.items.push(data);
        });
      } else {
        this.items = [];
      }
    }).catch(e => {
      this.isLoaded = true;
      console.log("e", e);
    });
    await this.spinner.hide();
  }
  async exportPdf(type: SupportedExtensions, opt?: string) {
    this.btnOps.active = true;
    this.exportAsConfig.type = type;
    if (opt) {
      this.exportAsConfig.options.jsPDF.orientation = opt;
    }
    let fileName = 'Fresh-Eggs-Inventory-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd');
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
