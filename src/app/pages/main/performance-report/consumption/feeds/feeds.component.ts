import { Component, OnInit } from '@angular/core';
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
import { ReportFeedsConsumptionComponent } from './../../../../../components/modals/reports/report-feeds-consumption/report-feeds-consumption.component';
import { AuthService } from './../../../../../services/auth/auth.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss']
})
export class FeedsComponent implements OnInit {
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
          labelString: 'Total consumed feeds (grams)',
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
          return 'Week ' + title[0].label;
        },
        label: function(item, data) {
          let index = item.index;
          let datasetIndex = item.datasetIndex;
          console.log("datasetIndex", datasetIndex);
          let total = 0;
          data.datasets.forEach(dset => {
            total += Number(dset.data[index]);
          });
          let label = data.datasets[datasetIndex].label;
          console.log("label", label);
          /* return "a"; */
          return label;
        },
        footer: function(item, data) {
          let piece: any = 0;
          if (Number(item[0].value) != 0) {
            let parts = item[0].value.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            piece = parts.join(".");
          }
          return "Consumed: " + piece + " g";
        }
      }
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          return null;
        },
      },
    },
  };
  public lineChartLabels: Label[] = [];
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;
  public lineChartPlugins = [pluginDataLabels];
  public lineChartData: ChartDataSets[] = [];

  chartvalues: any = [];
  chartlabels: any = [];

  isLoaded: boolean = false;
  items: any = [];
  totalItems: number = 0;
  
  prev_page: number = 0;
  next_page: number = 0;
  totalPages: number = 0;

  page: number = 1;
  limit: number = 10;
  limit_disabled: number = 0;

  order: any = {
    order_by_column: 'age_week',
    order_by: 'asc'
  };
  from: any = null;
  to: any = null;
  created_at: any = [];
  activity: any = [];
  showtimeago: boolean = true;
  max_date: any = new Date();

  house_options: any = [];
  visible_columns: any = [];

  ths: any = [];
  overall_harvested_eggs: number = 0;

  charthousevalues: any = [];

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
    private eggTypeService: EggTypeService,
    private generalService: GeneralService,
    private houseService: HouseService,
    private performanceReportService: PerformanceReportService,
    private router: Router,
    private exportAsService: ExportAsService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {

  }

  /* loopDates() {
    let loop = new Date(this.from);
    while (loop <= new Date(this.to)) {
      this.barChartLabels.push(this.datePipe.transform(new Date(loop), 'MM/dd'));
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
  } */

  async ngOnInit() {
    await this.resetDate();
    await this.spinner.show();
    await this.auth.validateUserRole();
    await this.getHouses();
    await this.getActivity('daily_reports_listing');
    /* this.getRecord(); */
  }
  async getList() {
    await this.performanceReportService.getFeedConsumptionReport(this.page, this.limit, null, this.from, this.to, this.order).then(res => {
      /* this.isLoaded = true; */
      if (res['error'] == 0) {
        this.totalItems = Number(res['total_count']) + 1;
        this.totalPages = res['total_page'];
        this.prev_page = res['previous_page'];
        this.next_page = res['next_page'];
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        res['datas'].forEach(data => {
          this.items.push(data);
        });
      } else {
        this.isLoaded = true;
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
    this.lineChartLabels = [];
    this.lineChartData = [];
    this.chartvalues = [];
    this.charthousevalues.forEach(chv => {
      chv.data.forEach((e, index) => {
        chv.data[index] = 0;
      });
    });
    this.totalItems = this.totalItems == 1 ? 2 : this.totalItems;
    await this.performanceReportService.getFeedConsumptionReport(1, this.totalItems, null, this.from, this.to, this.order).then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          this.lineChartLabels.push(data.age_week);
          let index_of_date = this.lineChartLabels.indexOf(data.age_week);
          this.charthousevalues.forEach(chv => {
            if (chv.house_id == 'Recommended') {
              chv.data[index_of_date] = data.rec_feed_consumption;
              chv.backgroundColor = 'transparent';
              chv.hoverBackgroundColor = 'transparent';
              chv.lineTension = 0;
            }
            let findhome = data.house.find(x => x.id == chv.house_id);
            if (findhome && findhome.daily_harvest_report) {
              chv.data[index_of_date] = findhome.daily_harvest_report.sum;
              let findIfVisible = this.ths.find(x => x.key == chv.house_id);
              chv.hidden = !findIfVisible.isVisible;
              chv.backgroundColor = 'transparent';
              chv.hoverBackgroundColor = 'transparent';
              chv.lineTension = 0;
            }
          });

        });
        this.lineChartData = this.charthousevalues;
      } else {
        this.lineChartData = this.charthousevalues;
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
      this.lineChartData = this.charthousevalues;
    });
  }
  async getHouses() {
    await this.houseService.getAllList().then(res => {
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          this.house_options.push(data);
          this.ths.push({
            label: 'House/Bldg no. ' + data.house_name,
            key: data.id,
            canSort: false,
            isVisible: true,
            canToggle: true
          });
          /* this.visible_columns.push(data.id); */
        });

        this.charthousevalues.push({
          data: [],
          house_id: 'Recommended',
          label: 'Recommended'
          /* backgroundColor: '#FFC575',
          hoverBackgroundColor: '#FFB247', */
        });
        this.lineChartLabels.forEach(() => {
          this.charthousevalues[0].data.push(0);
        });
        this.ths.forEach((data, index) => {
          this.visible_columns.push(index);
          /* this.chartvalues.push(0); */
          this.charthousevalues.push({
            data: [],
            house_id: data.key,
            label: data.label,
            /* backgroundColor: '#FFC575',
            hoverBackgroundColor: '#FFB247', */
          });
          this.lineChartLabels.forEach(() => {
            this.charthousevalues[index].data.push(0);
          });
        });

        this.getList();
      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  async chooseCreatedAt(e) {
    this.from = this.datePipe.transform(new Date(this.created_at.begin), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(this.created_at.end), 'yyyy-MM-dd');
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    this.chartvalues = [];
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
  counter(i: number) {
    return new Array(i);
  }
  async clearFilters() {
    await this.resetDate();
    this.isLoaded = false;
    this.page = 1;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    this.chartvalues = [];
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
  async gotoPage(page) {
    if (this.page != page) {
      this.isLoaded = false;
      this.page = page.pageIndex + 1;
      this.items = [];
      this.totalItems = 0;
      this.totalPages = 0;
      await this.getList();
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
    await setTimeout(() => {
      this.spinner.hide();
    }, 1500);
  }
  async changeColumnVisibility(e) {
    console.log("e", e);
    this.ths.forEach((data, index) => {
      data.isVisible = this.visible_columns.some(e => e == index);
      /* this.barChartData[index].hidden = true;
      console.log("this.barChartData[index]", this.barChartData[index]); */
    });
    this.getGraph();
  }
  openModal() {
    this.btnOps.active = true;
    let dialog = this.dialog.open(ReportFeedsConsumptionComponent, {
      /* width: '400px', */
      panelClass: "scroll",
      data: {
        page: 1,
        limit: this.totalItems,
        from: this.from,
        to: this.to,
        order: this.order,
        visible_columns: this.visible_columns,
        ths: this.ths,
        lineChartLabels: this.lineChartLabels,
        charthousevalues: this.charthousevalues
      }
    });
    dialog.afterClosed().subscribe((result: any) => {
      setTimeout(() => {
        this.btnOps.active = false;
      }, 1500);
    });
  }
}
