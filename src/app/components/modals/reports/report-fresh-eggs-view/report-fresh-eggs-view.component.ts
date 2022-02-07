import { Component, OnInit, Inject } from '@angular/core';
import { InventoryStocksService } from './../../../../services/inventory-stocks/inventory-stocks.service';
import { DatePipe } from '@angular/common';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

export interface DialogData {
  item: any,
  items: any,
  ths: any,
  visible_columns: any
};

@Component({
  selector: 'app-report-fresh-eggs-view',
  templateUrl: './report-fresh-eggs-view.component.html',
  styleUrls: ['./report-fresh-eggs-view.component.scss']
})
export class ReportFreshEggsViewComponent implements OnInit {

  isLoaded: boolean = false;
  item: any = [];
  items: any = [];
  ths: any = [];
  visible_columns: any = [];

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
    public dialogRef: MatDialogRef<ReportFreshEggsViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private datePipe: DatePipe,
    private inventoryStocksService: InventoryStocksService,
    private exportAsService: ExportAsService,
    private spinner: NgxSpinnerService
  ) {

  }

  async ngOnInit() {
    await this.spinner.show();
    let user = await JSON.parse(localStorage.getItem("user"));
    this.user_profile = user;
    this.item = this.data.item;
    this.items = this.data.items;
    this.visible_columns = this.data.visible_columns;
    this.ths = this.data.ths;
    this.isLoaded = true;
    await this.spinner.hide();
  }
  async exportPdf(type: SupportedExtensions, opt?: string) {
    this.btnOps.active = true;
    this.exportAsConfig.type = type;
    if (opt) {
      this.exportAsConfig.options.jsPDF.orientation = opt;
    }
    let fileName = 'Fresh-Eggs-Inventory-View-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd');
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
