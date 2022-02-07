import { Component, OnInit, Inject } from '@angular/core';
import { datatable } from './../../../../components/datatables/daily-reports-listing/daily-reports-listing';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DailyReportsService } from './../../../../services/daily-reports/daily-reports.service';
import { DatePipe } from '@angular/common';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

export interface DialogData {
  page: number,
  limit: number,
  from: any,
  to: any,
  visible_columns: any,
  ths: any,
  type: any,
  flockmanId: any,
  order: any,
  search: any,
};
@Component({
  selector: 'app-report-daily',
  templateUrl: './report-daily.component.html',
  styleUrls: ['./report-daily.component.scss']
})
export class ReportDailyComponent implements OnInit {

  isLoaded: boolean = false;

  ths: any = datatable;

  visible_columns: any = [];

  items: any = [];
  totalItems: number = 0;

  page: number = 1;
  limit: number = 10;
  limit_disabled: number = 0;
  order: any = {
    order_by_column: 'id',
    order_by: 'asc'
  };
  search: any = '';
  staff_items: any = [];
  flockmanId: number = 0;
  type: number = 0;
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
  all: boolean = true;

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
    public dialogRef: MatDialogRef<ReportDailyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dailyReportsService: DailyReportsService,
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
    this.page = this.data.page;
    this.limit = this.data.limit;
    this.from = this.data.from;
    this.to = this.data.to;
    this.visible_columns = this.data.visible_columns;
    this.ths = this.data.ths;
    this.type = this.data.type;
    this.flockmanId = this.data.flockmanId;
    this.order = this.data.order;
    this.search = this.data.search;
    await this.getList();
  }
  async getList() {
    await this.dailyReportsService.getList(this.page, this.limit, this.type, this.flockmanId, this.from, this.to, this.order, this.search).then((res: any) => {
      this.isLoaded = true;
      if (res.error == 0) {
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
    await this.spinner.hide();
  }
  async exportPdf(type: SupportedExtensions, opt?: string) {
    this.btnOps.active = true;
    this.exportAsConfig.type = type;
    if (opt) {
      this.exportAsConfig.options.jsPDF.orientation = opt;
    }
    let fileName = 'Report-Daily-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd');
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
