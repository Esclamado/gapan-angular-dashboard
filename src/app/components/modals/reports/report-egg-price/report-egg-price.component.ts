import { Component, OnInit, Inject } from '@angular/core';
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

import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportFooterComponent } from './../report-footer/report-footer.component';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

export interface DialogData {
  page: number,
  limit: number,
  type: number,
  from: any,
  to: any,
  order: any,
  search: any,
  ths: any,
  visible_columns: any
};

@Component({
  selector: 'app-report-egg-price',
  templateUrl: './report-egg-price.component.html',
  styleUrls: ['./report-egg-price.component.scss']
})
export class ReportEggPriceComponent implements OnInit {

  isLoaded: boolean = false;

  ths: any = datatable;
  limits: any = limitoptions;

  egg_type_options: any = [];

  visible_columns: any = [];

  items: any = [];
  totalItems: number = 0;
  
  prev_page: number = 0;
  next_page: number = 0;
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
  type: number;
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

  constructor(
    public dialogRef: MatDialogRef<ReportEggPriceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private exportAsService: ExportAsService,
    private dialog: MatDialog,
    private events: EventsService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private eggTypeService: EggTypeService,
    private generalService: GeneralService,
    private priceManagementService: PriceManagementService,
    private spinner: NgxSpinnerService
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  async ngOnInit() {
    let user = await JSON.parse(localStorage.getItem("user"));
    this.user_profile = user;
    this.page = this.data.page;
    this.limit = this.data.limit;
    this.from = this.data.from;
    this.to = this.data.to;
    this.ths = this.data.ths;
    this.type = this.data.type;
    this.order = this.data.order;
    this.search = this.data.search;
    this.visible_columns = this.data.visible_columns;
    await this.getList();
  }
  async getList() {
    await this.priceManagementService.getList(this.page, this.limit, this.type, this.from, this.to, this.order, this.search).then((res: any) => {
      this.isLoaded = true;
      if (res.error == 0) {
        res.datas.forEach(data => {
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
    await this.spinner.hide();
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
  async exportPdf(type: SupportedExtensions, opt?: string) {
    this.btnOps.active = true;
    this.exportAsConfig.type = type;
    if (opt) {
      this.exportAsConfig.options.jsPDF.orientation = opt;
    }
    let fileName = 'Report-Egg-Price-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd');
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
