import { Component, OnInit, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

export interface DialogData {
  daily_report: any,
  sorting_report: any
};

@Component({
  selector: 'app-report-daily-view',
  templateUrl: './report-daily-view.component.html',
  styleUrls: ['./report-daily-view.component.scss']
})
export class ReportDailyViewComponent implements OnInit {

  item: any = [];
  sorting_item: any = [];
  user_profile: any = [];
  date_today: any = new Date();
  isLoaded: boolean = false;

  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementId: 'printable-section',
    options: {
      jsPDF: {
        orientation: 'portrait',
        format: 'legal',
      },
      html2canvas:  {
        scale: 2
      },
      margin: 10,
      compress: true,
      pagebreak: {
        after: '.break-now'
      },
      image: {
        type: 'jpeg',
        quality: 0.95
      }
    }
  };

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
    public dialogRef: MatDialogRef<ReportDailyViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private exportAsService: ExportAsService,
    public _route: ActivatedRoute,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService
  ) { }

  async ngOnInit() {
    await this.spinner.show();
    this.user_profile = await JSON.parse(localStorage.getItem("user"));
    this.item = this.data.daily_report;
    this.sorting_item = this.data.sorting_report;
    this.isLoaded = true;
    await this.spinner.hide();
  }
  async exportPdf(type: SupportedExtensions, opt?: string) {
    this.btnOps.active = true;
    this.exportAsConfig.type = type;
    if (opt) {
      this.exportAsConfig.options.jsPDF.orientation = opt;
    }
    let fileName = 'Report-Daily-View-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
      setTimeout(() => {
        this.btnOps.active = false;
        this.dialogRef.close();
      }, 1500);
    });
  }
}
