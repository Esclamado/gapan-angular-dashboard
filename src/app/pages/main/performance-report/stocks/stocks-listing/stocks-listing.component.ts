import { Component, OnInit } from '@angular/core';
import { datatable } from './../../../../../components/datatables/performance-report/stocks/stocks';
import { limitoptions } from './../../../../../components/datatables/limit/limit';
import { GeneralService } from './../../../../../services/general/general.service';
import { EggTypeService } from './../../../../../services/egg-type/egg-type.service';
import { HouseService } from './../../../../../services/house/house.service';
import { PerformanceReportService } from './../../../../../services/performance-report/performance-report.service';
import { DatePipe } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { MatDialog } from '@angular/material/dialog';
import { ReportStocksComponent } from './../../../../../components/modals/reports/report-stocks/report-stocks.component';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { AuthService } from './../../../../../services/auth/auth.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-stocks-listing',
  templateUrl: './stocks-listing.component.html',
  styleUrls: ['./stocks-listing.component.scss']
})
export class StocksListingComponent implements OnInit {

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

  page: number = 1;
  limit: number = 10;
  limit_disabled: number = 0;
  limits: any = limitoptions;
  order: any = {
    order_by_column: 'created_at',
    order_by: 'desc'
  };
  from: any = null;
  to: any = null;
  created_at: any = [];
  show_filter: boolean = false;
  max_date: any = new Date();

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
    private auth: AuthService,
    private datePipe: DatePipe,
    private generalService: GeneralService,
    private performanceReportService: PerformanceReportService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
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
  }

  async ngOnInit() {
    await this.resetDate();
    await this.loopDates();
    await this.spinner.show();
    await this.auth.validateUserRole();
    await this.getList();
  }
  async getList() {
    await this.performanceReportService.getStocks(this.page, this.limit, this.from, this.to, this.order).then((res: any) => {
      this.isLoaded = true;
      console.log("res", res);
      if (res.error == 0) {
        this.totalItems = res.total_count;
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        this.item = res.data;
        res.datas.forEach((data: any) => {
          data.date = this.datePipe.transform(new Date(data.created_at), 'yyyy-MM-dd');
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
            hoverBackgroundColor: '#e58f17',
          },
          {
            data: this.chartvalues_out,
            label: 'Outflow',
            backgroundColor: '#FFC575',
            hoverBackgroundColor: '#ffca82',
          }
        ];
      } else {
        this.barChartData = [
          {
            data: this.chartvalues_in,
            label: 'Inflow',
            backgroundColor: '#FF9F1A',
            hoverBackgroundColor: '#e58f17',
          },
          {
            data: this.chartvalues_out,
            label: 'Outflow',
            backgroundColor: '#FFC575',
            hoverBackgroundColor: '#ffca82',
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
          hoverBackgroundColor: '#e58f17',
        },
        {
          data: this.chartvalues_out,
          label: 'Outflow',
          backgroundColor: '#FFC575',
          hoverBackgroundColor: '#ffca82',
        }
      ];
    });
    await setTimeout(() => {
      this.spinner.hide();
    }, 1500);
  }
  async searchItem() {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    await this.getList();
  }
  async changeLimit(e) {
    this.isLoaded = false;
    this.items = [];
    this.page = 1;
    this.totalItems = 0;
    await this.getList();
  }
  async gotoPage(page) {
    if (this.page != page) {
      this.isLoaded = false;
      this.page = page.pageIndex + 1;
      this.items = [];
      this.totalItems = 0;
      await this.getList();
    }
  }
  async chooseCreatedAt(e) {
    this.from = this.datePipe.transform(new Date(this.created_at.begin), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(this.created_at.end), 'yyyy-MM-dd');
    this.isLoaded = false;
    this.items = [];
    this.item = [];
    this.totalItems = 0;
    this.chartvalues_in = [];
    this.chartvalues_out = [];
    this.barChartLabels = [];
    this.loopDates();
    await this.getList();
  }
  async orderList(can_sort, order_by_column, order_by) {
    if (can_sort) {
      this.order = {
        order_by_column: order_by_column,
        order_by: order_by
      };
      this.isLoaded = false;
      this.items = [];
      this.totalItems = 0;
      await this.getList();
    }
  }
  async clearFilters() {
    await this.resetDate();
    this.isLoaded = false;
    this.page = 1;
    this.items = [];
    this.item = [];
    this.totalItems = 0;
    this.chartvalues_in = [];
    this.chartvalues_out = [];
    this.barChartLabels = [];
    this.loopDates();
    await this.getList();
  }
  async resetDate() {
    let dateToday = new Date();
    let year = dateToday.getFullYear();
    let month = dateToday.getMonth();
    this.from = this.datePipe.transform(new Date(year, month, 1), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(dateToday), 'yyyy-MM-dd');
    this.created_at = {
      begin: this.from,
      end: this.to
    };
  }
  counter(i: number) {
    return new Array(i);
  }
  openModal() {
    this.btnOps.active = true;
    let dialog = this.dialog.open(ReportStocksComponent, {
      /* width: '400px', */
      panelClass: "scroll",
      data: {
        page: 1,
        limit: this.totalItems,
        from: this.from,
        to: this.to,
        visible_columns: this.visible_columns,
        ths: this.ths
      }
    });
    dialog.afterClosed().subscribe((result: any) => {
      setTimeout(() => {
        this.btnOps.active = false;
      }, 1500);
    });
  }
}
