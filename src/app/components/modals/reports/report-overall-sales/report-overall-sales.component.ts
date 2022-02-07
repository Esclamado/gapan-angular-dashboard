import { Component, OnInit, Inject } from '@angular/core';
import { datatable } from './../../../datatables/performance-report/sales/overall-sales/overall-sales';
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
  ths: any
};

@Component({
  selector: 'app-report-overall-sales',
  templateUrl: './report-overall-sales.component.html',
  styleUrls: ['./report-overall-sales.component.scss']
})
export class ReportOverallSalesComponent implements OnInit {
  
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    spanGaps: true,
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
          labelString: 'Total amount of sales',
          fontSize: 14,
          lineHeight: 4,
          fontColor: '#05172e'
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
        label: function (tooltipItem, data) {
          return tooltipItem.label/* this.datePipe.transform(new Date(tooltipItem.label), 'MMM dd') */;
        },
        footer: function(item, data) {
          console.log("item", item);
          console.log("data", data);
          if (parseInt(item[0].value) >= 1000){
            return 'Sales: ₱ ' + item[0].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          } else {
            return 'Sales: ₱ ' + item[0].value;
          }
        }
      }
    },
    plugins: {
      datalabels: {
        display: false,
      },
    }
  };
  public lineChartLabels: Label[] = [];
  public lineChartType: ChartType = 'line';
  public lineChartLegend = false;
  public lineChartPlugins = [pluginDataLabels];
  public lineChartData: ChartDataSets[] = [];
  chartvalues: any = [];
  chartlabels: any = [];
  overall_value: number = 0;

  isLoaded: boolean = false;

  ths: any = datatable;

  visible_columns: any = [];

  items: any = [];
  item: any = [];
  totalItems: number = 0;
  
  prev_page: number = 0;
  next_page: number = 0;
  totalPages: number = 0;

  page: number = 1;
  limit: number = 10;
  limit_disabled: number = 0;
  order: any = {
    order_by_column: 'created_at',
    order_by: 'asc'
  };
  from: any = null;
  to: any = null;
  created_at: any = [];
  show_filter: boolean = false;
  activity: any = [];
  showtimeago: boolean = true;

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
    public dialogRef: MatDialogRef<ReportOverallSalesComponent>,
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
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    let user = JSON.parse(localStorage.getItem("user"));
    this.user_profile = user;
    this.page = this.data.page;
    this.limit = this.data.limit;
    this.from = this.data.from;
    this.to = this.data.to;
    this.visible_columns = this.data.visible_columns;
    this.ths = this.data.ths;
    await this.loopDates();
    /* this.getList(); */
  }
  loopDates() {
    let loop = new Date(this.from);
    while (loop <= new Date(this.to)) {
      this.lineChartLabels.push(this.datePipe.transform(new Date(loop), 'MM/dd'));
      this.chartvalues.push(null);
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    this.getList();
  }
  async getList() {
    await this.performanceReportService.getOverallSales(this.page, this.limit, this.from, this.to, this.order).then((res: any) => {
      console.log('Overallsales',res);
      if (res.error == 0) {
        this.totalItems = res.total_count;
        this.totalPages = res.total_page;
        this.prev_page = res.previous_page;
        this.next_page = res.next_page;
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        this.item = res.data;
        res.datas.forEach((data: any) => {
          this.items.push(data);
        });
      } else {
        this.items = [];
        this.totalItems = 0;
        this.totalPages = 0;
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
    });
    this.getGraph();
  }
  async getGraph() {
    /* this.chartvalues = [];
    this.chartlabels = [];
    this.lineChartLabels = []; */
    this.overall_value = 0;
    this.lineChartData = [];
    this.totalItems = this.totalItems == 1 ? 2 : this.totalItems;
    await this.performanceReportService.getOverallSales(1, this.totalItems, this.from, this.to, this.order).then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          let getIndex = this.lineChartLabels.indexOf(this.datePipe.transform(new Date(data.date), 'MM/dd'));
          this.chartvalues[getIndex] = Number(data.total);
          this.overall_value += Number(data.total);
        });
        this.lineChartData = [
          {
            data: this.chartvalues,
            label: 'Sales',
            borderColor: '#FF9F1A',
            backgroundColor: 'transparent',
            hoverBackgroundColor: 'transparent',
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#FF9F1A',
            lineTension: 0
          }
        ];
        console.log(this.lineChartData);
      } else {
        this.lineChartData = [
          {
            data: this.chartvalues,
            label: 'Sales',
            borderColor: '#FF9F1A',
            backgroundColor: 'transparent',
            hoverBackgroundColor: 'transparent',
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#FF9F1A',
            lineTension: 0
          }
        ];
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
      this.lineChartData = [
        {
          data: this.chartvalues,
          label: 'Sales',
          borderColor: '#FF9F1A',
          backgroundColor: 'transparent',
          hoverBackgroundColor: 'transparent',
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#FF9F1A',
          lineTension: 0
        }
      ];
    });
    await this.spinner.hide();
  }
  async exportPdf(type: SupportedExtensions, opt?: string) {
    this.btnOps.active = true;
    this.exportAsConfig.type = type;
    if (opt) {
      this.exportAsConfig.options.jsPDF.orientation = opt;
    }
    let fileName = 'Report-Sales-Overall-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd');
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
