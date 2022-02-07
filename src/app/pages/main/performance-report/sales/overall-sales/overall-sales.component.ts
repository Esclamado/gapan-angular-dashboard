import { Component, OnInit } from '@angular/core';
import { datatable } from './../../../../../components/datatables/performance-report/sales/overall-sales/overall-sales';
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
import { ReportOverallSalesComponent } from './../../../../../components/modals/reports/report-overall-sales/report-overall-sales.component';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { AuthService } from './../../../../../services/auth/auth.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-overall-sales',
  templateUrl: './overall-sales.component.html',
  styleUrls: ['./overall-sales.component.scss']
})
export class OverallSalesComponent implements OnInit {

  /* chart */
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
  overall_value: number = 0;

  isLoaded: boolean = false;

  ths: any = datatable;

  visible_columns: any = [];

  items: any = [];
  item: any = [];
  totalItems: number = 0;
  totalItems2: number = 0;
  
  prev_page: number = 0;
  next_page: number = 0;
  totalPages: number = 0;
  totalPages2: number = 0;

  page: number = 1;
  page2: number = 1;
  limit: number = 10;
  limit2: number = 10;
  limit_disabled: number = 0;
  limit_disabled2: number = 0;
  order: any = {
    order_by_column: 'created_at',
    order_by: 'desc'
  };
  from: any = null;
  to: any = null;
  created_at: any = [];
  show_filter: boolean = false;
  activity: any = [];
  showtimeago: boolean = true;
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

  highest_orders: any = [];

  constructor(
    private auth: AuthService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private generalService: GeneralService,
    private performanceReportService: PerformanceReportService,
    private spinner: NgxSpinnerService
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  loopDates() {
    let loop = new Date(this.from);
    while (loop <= new Date(this.to)) {
      this.lineChartLabels.push(this.datePipe.transform(new Date(loop), 'MM/dd'));
      this.chartvalues.push(null);
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
    await this.getActivity('transactions_listing');
    await this.getHighestorders();
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
    /* this.chartvalues = []; */
    /* this.chartlabels = []; */
    /* this.lineChartLabels = []; */
    this.overall_value = 0;
    this.lineChartData = [];
    this.totalItems = this.totalItems == 1 ? 2 : this.totalItems;
    await this.performanceReportService.getOverallSales(1, this.totalItems, this.from, this.to, this.order).then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          console.log('total data', data.total);
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
  }
  async chooseCreatedAt(e) {
    this.from = this.datePipe.transform(new Date(this.created_at.begin), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(this.created_at.end), 'yyyy-MM-dd');
    this.isLoaded = false;
    this.items = [];
    this.item = [];
    this.totalItems = 0;
    this.totalPages = 0;
    this.chartvalues = [];
    this.lineChartLabels = [];
    this.loopDates();
    await this.getList();
    await this.getHighestorders();
  }
  async changeColumnVisibility(e) {
    this.ths.forEach((data, index) => {
      data.isVisible = this.visible_columns.some(e => e == index);
    });
    /* if (this.visible_columns.length == 1) {
      let i = this.ths.length - 1;
      this.ths[i].isVisible = false;
    } else {
      let i = this.ths.length - 1;
      this.ths[i].isVisible = true;
    } */
    /* this.getGraph(); */
  }
  async orderList(can_sort, order_by_column, order_by) {
    if (can_sort) {
      this.order = {
        order_by_column: order_by_column,
        order_by: order_by
      };
      this.isLoaded = false;
      this.items = [];
      this.item = [];
      this.totalItems = 0;
      this.totalPages = 0;
      await this.getList();
    }
  }
  counter(i: number) {
    return new Array(i);
  }
  async clearFilters() {
    await this.resetDate();
    this.isLoaded = false;
    this.page = 1;
    this.items = [];
    this.item = [];
    this.totalItems = 0;
    this.totalPages = 0;
    this.chartvalues = [];
    this.lineChartLabels = [];
    this.loopDates();
    await this.getList();
    await this.getHighestorders();
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
  async gotoPage(page) {
    if (this.page != page) {
      this.isLoaded = false;
      this.page = page.pageIndex + 1;
      this.items = [];
      this.item = [];
      this.totalItems = 0;
      this.totalPages = 0;
      await this.getList();
    }
  }
  async gotoPage2(page2) {
    if (this.page2 != page2) {
      /* this.isLoaded = false; */
      this.page2 = page2.pageIndex + 1;
      this.highest_orders = [];
      this.totalItems2 = 0;
      this.totalPages2 = 0;
      await this.getHighestorders();
    }
  }
  async getActivity(page) {
    await this.generalService.getActivity(page).then(res => {
      if (res['error'] == 0) {
        this.showtimeago = true;
        this.activity = res['data'];
      } else {
        this.showtimeago = false;
      }
    }).catch(e => {
      console.log(e);
      this.showtimeago = false;
    });
  }
  openModal() {
    this.btnOps.active = true;
    let dialog = this.dialog.open(ReportOverallSalesComponent, {
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
  async getHighestorders() {
    await this.performanceReportService.getLocationwithhighestorders(this.page2, this.limit2, this.from, this.to).then((res: any) => {
      console.log('getHighestorders', res);
      if (res.error == 0) {
        this.totalItems2 = res.total_count;
        this.totalPages2 = res.total_page;
        if (this.totalItems2 < 10) {
          this.limit_disabled2 = this.totalItems2;
        }
        res.datas.forEach((data: any) => {
          this.highest_orders.push(data);
        });
        /* res['data'].forEach(data => {
          this.highest_orders.push(data);
        }); */
      } else {
        /* this.highest_orders = []; */
        this.highest_orders = [];
        this.totalItems2 = 0;
        this.totalPages2 = 0;
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
    });
    await setTimeout(() => {
      this.spinner.hide();
    }, 1500);
  }
}
