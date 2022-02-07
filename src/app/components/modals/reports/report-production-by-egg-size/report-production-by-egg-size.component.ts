import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { PerformanceReportService } from './../../../../services/performance-report/performance-report.service';
import { EggTypeService } from './../../../../services/egg-type/egg-type.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

export interface DialogData {
  page: number,
  limit: number,
  from: any,
  to: any,
  visible_columns: any,
  ths: any,
  house_id: number,
  items: any,
  barChartLabels: any,
  barChartData: any,
  overall_harvested_eggs: number
};

@Component({
  selector: 'app-report-production-by-egg-size',
  templateUrl: './report-production-by-egg-size.component.html',
  styleUrls: ['./report-production-by-egg-size.component.scss']
})
export class ReportProductionByEggSizeComponent implements OnInit {

  page: number = 1;
  limit: number;
  from: any;
  to: any;
  visible_columns: any = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    layout: {
      padding: {
        top: 20
      }
    },
    scales: {
      yAxes: [{
        stacked: false,
        scaleLabel: {
          display: true,
          labelString: 'Total quantity of eggs',
          fontSize: 14,
          lineHeight: 4,
          fontColor: '#05172e',
        },
        ticks: {
           min: 0,
           fontSize: 12,
           fontColor: '#05172e',
           callback: function(label, index, labels) {
            let SI_POSTFIXES = ["", "K", "M", "G", "T", "P", "E"];
            let tier = Math.log10(Math.abs(label)) / 3 | 0;
            if(tier == 0) return label;
            let postfix = SI_POSTFIXES[tier];
            let scale = Math.pow(10, tier * 3);
            let scaled = label / scale;
            let formatted = scaled.toFixed(1) + '';
            if (/\.0$/.test(formatted))
              formatted = formatted.substr(0, formatted.length - 2);
            return formatted + postfix;
          }
        },
      }],
      xAxes: [{
        stacked: false,
        ticks: {
          fontSize: 12,
          fontColor: '#72787F',
          beginAtZero: true,
          min: 0
        }
      }]
    },
    legend: {
      position: 'right',
      labels: {
        fontSize: 10,
        usePointStyle: true,
      },
      align: 'start'
    },
    tooltips: {
      callbacks: {
        title: (title, data) => {
          return null;
        },
        label: function(item, data) {
          return "Size: " + item.label;
        },
        footer: function(item, data) {
          if (Number(item[0].value) == 0) {
            return null;
          } else {
            let parts = item[0].value.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return "Qty: " + parts.join(".") + ' pcs';
          }
        }
      }
    },
    plugins: {
      datalabels: {
        color: '#72787F',
        anchor: 'end',
        align: 'top',
        formatter: (value, ctx) => {
          let SI_POSTFIXES = ["", "K", "M", "G", "T", "P", "E"];
          let tier = Math.log10(Math.abs(value)) / 3 | 0;
          if(tier == 0) return value;
          let postfix = SI_POSTFIXES[tier];
          let scale = Math.pow(10, tier * 3);
          let scaled = value / scale;
          let formatted = scaled.toFixed(1) + '';
          if (/\.0$/.test(formatted))
            formatted = formatted.substr(0, formatted.length - 2);
          return formatted + postfix;
        },
      },
    },
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [];

  chartvalues: any = [];
  chartlabels: any = [];

  isLoaded: boolean = false;
  items: any = [];
  totalItems: number = 0;
  
  prev_page: number = 0;
  next_page: number = 0;
  totalPages: number = 0;

  limit_disabled: number = 0;

  order: any = {
    order_by_column: 'id',
    order_by: 'asc'
  };
  created_at: any = [];
  activity: any = [];
  showtimeago: boolean = true;
  max_date: any = new Date();

  egg_type_options: any = [];

  house_options: any = [];
  selected_house: any = [];

  ths: any = [];
  overall_harvested_eggs: number = 0;

  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementId: 'printable-section',
    options: {
      jsPDF: {
        orientation: 'landscape',
        format: 'legal',
      },
      /* html2canvas:  {
        scale: 2
      }, */
      margin: 10,
      compress: true,
      pagebreak: {
        /* mode: 'avoid-all', */
        after: '.break-now'
      },
      /* image: {
        type: 'jpeg',
        quality: 0.95
      }, */
      /* compress: true,
      
      html2canvas:  {
        scale: 2
      },
      pagebreak: {
        before: '.break-now'
      },
      fileName: 'asd.pdf', */
      /* pdfCallbackFn: this.pdfCallbackFn */ // to add header and footer
    }
  };
  user_profile: any = [];
  date_today: any = new Date();
  house_id: number;

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
    public dialogRef: MatDialogRef<ReportProductionByEggSizeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private eggTypeService: EggTypeService,
    private performanceReportService: PerformanceReportService,
    private router: Router,
    private exportAsService: ExportAsService,
    private spinner: NgxSpinnerService
  ) {

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
    this.house_id = this.data.house_id;
    this.barChartLabels = this.data.barChartLabels;
    this.barChartData = this.data.barChartData;
    this.overall_harvested_eggs = this.data.overall_harvested_eggs;
    await this.getEggTypeList();
  }
  async getEggTypeList() {
    await this.eggTypeService.getList().then((res: any) => {
      if (res.error == 0) {
        res.datas.forEach((data, index) => {
          this.egg_type_options.push(data);
        });
        this.ths.forEach((data, index) => {
          this.visible_columns.push(index);
        });
        this.getList();
      } else {
        this.spinner.hide();
      }
    }).catch(e => {
      console.log(e);
      this.spinner.hide();
    });
  }
  async getList() {
    await this.performanceReportService.getProductionEggSize(this.page, this.limit, this.house_id, this.from, this.to, this.order).then(res => {
      if (res['error'] == 0) {
        this.isLoaded = true;
        res['datas'].forEach(data => {
          this.items.push(data);
        });
      } else {
        this.isLoaded = true;
        this.items = [];
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
    });
    await this.spinner.hide();
  }
  async exportPdf(type: SupportedExtensions, opt?: string) {
    this.btnOps.active = true;
    this.exportAsConfig.type = type;
    if (opt) {
      this.exportAsConfig.options.jsPDF.orientation = opt;
    }
    let fileName = 'Report-Production-By-Egg-Size-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    await this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
      setTimeout(() => {
        this.btnOps.active = false;
        this.dialogRef.close();
      }, 1500);
    });
  }
  pdfCallbackFn (pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30);
    }
  }
}
