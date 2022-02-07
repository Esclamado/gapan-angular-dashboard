import { Component, OnInit, Inject } from '@angular/core';
import { datatable } from './../../../datatables/performance-report/stocks/stocks';
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
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

export interface DialogData {
  page: number;
  limit: number;
  from: any,
  to: any,
  visible_columns: any,
  ths: any
};

@Component({
  selector: 'app-report-stocks',
  templateUrl: './report-stocks.component.html',
  styleUrls: ['./report-stocks.component.scss']
})
export class ReportStocksComponent implements OnInit {

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
          labelString: 'Total no. of stocks',
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
        }
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
          return item.label;
        },
        footer: function(item, data) {
          let index: number = item[0].index;
          let parts = data.datasets[0].data[index].toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

          let inflow_label = "Inflow: " + parts.join(".") + ' pcs';

          parts = data.datasets[1].data[index].toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          let outflow_label = "Outflow: " + parts.join(".") + ' pcs';

          console.log("parts", parts);
          console.log("data.datasets[0].data[index]", data.datasets[1].data[index]);
          return inflow_label + "\n" + outflow_label;
        }
      }
    },
    /* plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          return null;
        },
      },
    }, */
    plugins: {
      datalabels: {
        display: false
      },
    },
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [{ data: [] }];

  chartvalues_in: any = [];
  chartvalues_out: any = [];

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
    public dialogRef: MatDialogRef<ReportStocksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private performanceReportService: PerformanceReportService,
    private router: Router,
    private exportAsService: ExportAsService,
    private spinner: NgxSpinnerService
  ) { }

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
    await this.loopDates();
  }
  loopDates() {
    let loop = new Date(this.from);
    while (loop <= new Date(this.to)) {
      this.barChartLabels.push(this.datePipe.transform(new Date(loop), 'MM/dd'));
      this.chartvalues_in.push(0);
      this.chartvalues_out.push(0);
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    this.getList();
  }
  async getList() {
    await this.performanceReportService.getStocks(this.page, this.limit, this.from, this.to, this.order).then((res: any) => {
      this.isLoaded = true;
      if (res.error == 0) {
        this.totalItems = res.total_count;
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
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
    });
    this.getGraph();
  }
  async getGraph() {
    this.barChartData = [{ data: [] }];
    this.totalItems = this.totalItems == 1 ? 2 : this.totalItems;
    await this.performanceReportService.getStocks(1, this.totalItems, this.from, this.to, this.order).then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          let getIndex = this.barChartLabels.indexOf(this.datePipe.transform(new Date(data.created_at), 'MM/dd'));
          this.chartvalues_in[getIndex] = Number(data.total_egg_in);
          this.chartvalues_out[getIndex] = Number(data.total_egg_out);
        });
        this.barChartData = [
          {
            data: this.chartvalues_in,
            label: 'Inflow',
            backgroundColor: '#FF9F1A',
            hoverBackgroundColor: '#FFB247',
          },
          {
            data: this.chartvalues_out,
            label: 'Outflow',
            backgroundColor: '#FFC575',
            hoverBackgroundColor: '#FFB247',
          }
        ];
      } else {
        this.barChartData = [
          {
            data: this.chartvalues_in,
            label: 'Inflow',
            backgroundColor: '#FF9F1A',
            hoverBackgroundColor: '#FFB247',
          },
          {
            data: this.chartvalues_out,
            label: 'Outflow',
            backgroundColor: '#FFC575',
            hoverBackgroundColor: '#FFB247',
          }
        ];
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
      this.barChartData = [
        {
          data: this.chartvalues_in,
          label: 'Inflow',
          backgroundColor: '#FF9F1A',
          hoverBackgroundColor: '#FFB247',
        },
        {
          data: this.chartvalues_out,
          label: 'Outflow',
          backgroundColor: '#FFC575',
          hoverBackgroundColor: '#FFB247',
        }
      ];
    });
    await this.spinner.hide();
  }
  counter(i: number) {
    return new Array(i);
  }
  async exportPdf(type: SupportedExtensions, opt?: string) {
    this.btnOps.active = true;
    this.exportAsConfig.type = type;
    if (opt) {
      this.exportAsConfig.options.jsPDF.orientation = opt;
    }
    let fileName = 'Report-Stock-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
      setTimeout(() => {
        this.btnOps.active = false;
        this.dialogRef.close();
      }, 1500);
    });
  }
}
