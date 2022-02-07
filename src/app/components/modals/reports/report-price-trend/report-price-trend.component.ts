import { Component, OnInit, Inject } from '@angular/core';
import { datatable } from './../../../../components/datatables/price-management-view/price-management-view';
import { PriceManagementService } from './../../../../services/price-management/price-management.service';
import { EggTypeService } from './../../../../services/egg-type/egg-type.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

export interface DialogData {
  page: number,
  limit: number,
  type: number,
  from: any,
  to: any,
  order: any,
  ths: any,
  visible_columns: any
};

@Component({
  selector: 'app-report-price-trend',
  templateUrl: './report-price-trend.component.html',
  styleUrls: ['./report-price-trend.component.scss']
})
export class ReportPriceTrendComponent implements OnInit {

  isLoaded: boolean = false;

  ths: any = datatable;

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
    order_by_column: 'updated_at',
    order_by: 'asc'
  };
  type: number;
  from: any = null;
  to: any = null;
  created_at: any = [];
  type_name: any = '';
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    spanGaps: true,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Price',
          fontSize: 14,
          lineHeight: 4,
          fontColor: '#05172e'
        },
        ticks: {
          min: 0,
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
            /* let parts = label.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".") + ' g'; */
          }
        }
      }],
      xAxes: [{
        ticks: {
          beginAtZero: true,
          min: 0
        }
      }]
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
            return 'Price: ₱ ' + item[0].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          } else {
            return 'Price: ₱ ' + item[0].value;
          }
        }
      }
    },
    plugins: {
      datalabels: {
        display: false,
        /* color: '#05172e',
        formatter: (value, ctx) => {
          return '';
          if (value == 0) {
            return '';
          }
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
        }, */
      },
    }
    /* animation: {
      onComplete: function () {
        var chartInstance = this.chart,
        ctx = chartInstance.ctx;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x, bar._model.y - 5);
            });
        });
      }
    } */
  };
  public lineChartLabels: Label[] = [];
  public lineChartType: ChartType = 'line';
  public lineChartLegend = false;
  public lineChartPlugins = [pluginDataLabels];
  public lineChartData: ChartDataSets[] = [];

  chartvalues: any = [];
  chartlabels: any = [];

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
    public dialogRef: MatDialogRef<ReportPriceTrendComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private exportAsService: ExportAsService,
    public _route: ActivatedRoute,
    private datePipe: DatePipe,
    private eggTypeService: EggTypeService,
    private priceManagementService: PriceManagementService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    await this.getEggTypeList();
    let user = await JSON.parse(localStorage.getItem("user"));
    this.user_profile = user;
    this.page = this.data.page;
    this.limit = this.data.limit;
    this.from = this.data.from;
    this.to = this.data.to;
    this.ths = this.data.ths;
    this.type = this.data.type;
    this.order = this.data.order;
    this.visible_columns = this.data.visible_columns;
    /* this.getList(); */
    await this.loopDates();
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
  async getEggTypeList() {
    await this.eggTypeService.getList().then(res => {
      if (res['error'] == 0) {
        this.egg_type_options = res['datas'];
        let type_name = this.egg_type_options.find(x => x.id == this.type);
        this.type_name = type_name.type;
      } else {

      }
    }).catch(e => {
      console.log(e);
    });
  }
  async getList() {
    await this.priceManagementService.getPriceTrend(this.page, this.limit, this.type, this.from, this.to, this.order).then(res => {
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
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
    this.getGraph();
  }
  async getGraph() {
    this.chartvalues = [];
    this.lineChartData = [];
    await this.priceManagementService.getPriceTrend(1, this.limit, this.type, this.from, this.to, this.order).then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          let getIndex = this.lineChartLabels.indexOf(this.datePipe.transform(new Date(data.updated_at), 'MM/dd'));
          this.chartvalues[getIndex] = Number(data.price);
        });
        this.lineChartData = [
          {
            data: this.chartvalues,
            label: 'Price',
            borderColor: '#FF9F1A',
            backgroundColor: 'transparent',
            hoverBackgroundColor: 'transparent',
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#FF9F1A',
            lineTension: 0
          }
        ];
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
    let fileName = 'Report-Price-Trend-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd');
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
