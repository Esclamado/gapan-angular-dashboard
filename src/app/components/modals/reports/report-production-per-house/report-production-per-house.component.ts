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
import { HouseService } from './../../../../services/house/house.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

export interface DialogData {
  page: number,
  limit: number,
  from: any,
  to: any,
  order: any,
  visible_columns: any,
  ths: any,
  barChartLabels: any,
  charthousevalues: any,
  overall_harvested_eggs: number
};

@Component({
  selector: 'app-report-production-per-house',
  templateUrl: './report-production-per-house.component.html',
  styleUrls: ['./report-production-per-house.component.scss']
})
export class ReportProductionPerHouseComponent implements OnInit {

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
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: 'Total no. of eggs harvested',
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
        stacked: true,
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
        label: function(item, data) {
          let index = item.index;
          let datasetIndex = item.datasetIndex;
          let total = 0;
          data.datasets.forEach(dset => {
            total += Number(dset.data[index]);
          });
          let label = data.datasets[datasetIndex].label;
          return label;
        },
        footer: function(item, data) {
          let index = item[0].index;
          let overall: any = 0;
          data.datasets.forEach(dset => {
            if (!dset.hidden) {
              overall += Number(dset.data[index]);
            }
          });

          let piece: any = 0;
          if (Number(item[0].value) != 0) {
            let parts = item[0].value.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            piece = parts.join(".");
          }
          let parts = overall.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return "Total: " + piece + " pcs\nOverall: " + parts.join(".") + " pcs";
        }
      }
    },
    plugins: {
      datalabels: {
        color: '#72787F',
        anchor: 'end',
        align: 'top',
        formatter: (value, ctx) => {
          let datasets = ctx.chart.data.datasets;
          if (ctx.datasetIndex === datasets.length - 1) {
            let sum: number = 0;
            datasets.map(dataset => {
              sum += Number(dataset.data[ctx.dataIndex]);
            });
            let SI_POSTFIXES = ["", "K", "M", "G", "T", "P", "E"];
            let tier = Math.log10(Math.abs(sum)) / 3 | 0;
            if(tier == 0) return null;
            let postfix = SI_POSTFIXES[tier];
            let scale = Math.pow(10, tier * 3);
            let scaled = sum / scale;
            let formatted = scaled.toFixed(1) + '';
            if (/\.0$/.test(formatted))
              formatted = formatted.substr(0, formatted.length - 2);
            return formatted + postfix;
          } else {
            return null;
          }
        },
      },
    },
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
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

  house_options: any = [];

  ths: any = [];
  overall_harvested_eggs: number = 0;

  charthousevalues: any = [];

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
    public dialogRef: MatDialogRef<ReportProductionPerHouseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private houseService: HouseService,
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
    let user = await JSON.parse(localStorage.getItem("user"));
    this.user_profile = user;
    this.page = this.data.page;
    this.limit = this.data.limit;
    this.from = this.data.from;
    this.to = this.data.to;
    this.order = this.data.order;
    this.visible_columns = this.data.visible_columns;
    this.ths = this.data.ths;
    this.barChartLabels = this.data.barChartLabels;
    this.charthousevalues = this.data.charthousevalues;
    this.overall_harvested_eggs = this.data.overall_harvested_eggs;
    /* this.loopDates(); */
    await this.getList();
  }
  loopDates() {
    let loop = new Date(this.from);
    while (loop <= new Date(this.to)) {
      this.barChartLabels.push(this.datePipe.transform(new Date(loop), 'MM/dd'));
      /* this.chartvalues.push(0); */
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    this.getList();
  }
  async getList() {
    await this.performanceReportService.getProductionHouse(this.page, this.limit, null, this.from, this.to, this.order).then((res: any) => {
      /* this.isLoaded = true; */
      if (res.error == 0) {
        this.totalItems = Number(res.total_count) + 1;
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        res.datas.forEach(data => {
          this.items.push(data);
        });
      } else {
        this.isLoaded = true;
        this.items = [];
        this.totalItems = 0;
        this.totalPages = 0;
        this.spinner.hide();
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
      this.spinner.hide();
    });
    this.getGraph();
  }
  async getGraph() {
    this.barChartData = [];
    this.chartvalues = [];
    this.charthousevalues.forEach(chv => {
      chv.data.forEach((e, index) => {
        chv.data[index] = 0;
      });
    });
    this.totalItems = this.totalItems == 1 ? 2 : this.totalItems;
    await this.performanceReportService.getProductionHouse(1, this.totalItems, null, this.from, this.to, this.order).then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          let index_of_date = this.barChartLabels.indexOf(this.datePipe.transform(new Date(data.grouped_date), 'MM/dd'));
          this.charthousevalues.forEach(chv => {
            let findhome = data.house.find(x => x.id == chv.house_id);
            if (findhome && findhome.daily_sorting_report) {
              chv.data[index_of_date] = findhome.daily_sorting_report.sum;
              let findIfVisible = this.ths.find(x => x.key == chv.house_id);
              chv.hidden = !findIfVisible.isVisible;
            }
          });
        });
        this.barChartData = this.charthousevalues;
      } else {
        this.barChartData = this.charthousevalues;
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
      this.barChartData = this.charthousevalues;
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
    let fileName = 'Report-Production-Per-House-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
      setTimeout(() => {
        this.btnOps.active = false;
        this.dialogRef.close();
      }, 1500);
    });
  }
}
