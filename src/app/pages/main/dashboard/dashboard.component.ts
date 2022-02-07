import { Component, OnInit } from '@angular/core';
import { DashboardService } from './../../../services/dashboard/dashboard.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from "@angular/router";
import { AuthService } from './../../../services/auth/auth.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DatePipe } from '@angular/common';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  /* pie : start */
  /* public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
      labels: {
        fontSize: 14,
        fontColor: '#1E2631',
      }
    },
    tooltips: {
      callbacks: {
        label: function(item, data) {
          let datasetIndex = item.datasetIndex;
          let lbl = data.labels[datasetIndex];
          return lbl.toString();
        },
        footer: function(item, data) {
          console.log("item", item);
          console.log("data", data);
          let index = item[0].index;
          let value = Number(data.datasets[0].data[index]);
          const label = value.toFixed(2) + ' %';
          return value == 0 ? '' : 'Production Rate: ' + label;
        }
      }
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = value.toFixed(2) + ' %';
          return value == 0 ? '' : label;
        },
      },
    },
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  piechartvalues: any = []; */
  /* pie : end */

  /* bar : start */
  public barChartOptions2: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
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
          labelString: 'Production Rate (%)',
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
            if(tier == 0) return label + ' %';
            let postfix = SI_POSTFIXES[tier];
            let scale = Math.pow(10, tier * 3);
            let scaled = label / scale;
            let formatted = scaled.toFixed(1) + '';
            if (/\.0$/.test(formatted))
              formatted = formatted.substr(0, formatted.length - 2);
            return formatted + postfix + ' %';
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
          return item.label;
        },
        footer: function(item, data) {
          if (Number(item[0].value) == 0) {
            return null;
          } else {
            let parts = item[0].value.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return "Production Rate: " + parts.join(".") + ' %';
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
          if(tier == 0) return value + ' %';
          let postfix = SI_POSTFIXES[tier];
          let scale = Math.pow(10, tier * 3);
          let scaled = value / scale;
          let formatted = scaled.toFixed(1) + '';
          if (/\.0$/.test(formatted))
            formatted = formatted.substr(0, formatted.length - 2);
          return formatted + postfix + '%';
        },
      },
    },
  };
  public barChartLabels2: Label[] = [];
  public barChartType2: ChartType = 'bar';
  public barChartLegend2 = false;
  public barChartPlugins2 = [pluginDataLabels];

  public barChartData2: ChartDataSets[] = [];
  barchartvalues2: any = [];
  /* bar : end */

  /* bar : start */
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
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
          labelString: 'No. of consumed (g)',
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
        label: function(item, data) {
          return item.label;
        },
        footer: function(item, data) {
          if (Number(item[0].value) == 0) {
            return null;
          } else {
            let parts = item[0].value.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return "Consumed: " + parts.join(".") + ' g';
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
  barchartvalues: any = [];
  /* bar : end */

  dateToday: Date = new Date();
  type: number = 0;
  dashboard_data: any = null;
  feed_consumption_data: any = null;
  medicine_consumption_data: any = null;
  harvest_production_status_data: any = null;
  harvest_rate_data: any = null;
  recent_transactions_data: any = null;
  staff_activities_data: any = null;

  masonryItems = [
    {
      title: 'Feed Consumption',
      key: 'feed_consumption',
      url: '/performance-report/consumption/feeds'
    },
    {
      title: 'Medicine Consumption',
      key: 'medicine_consumption',
      url: '/performance-report/consumption/medicine'
    },
    {
      title: 'Harvest Production Status',
      key: 'harvest_production_status',
      url: '/daily-reports'
    },
    {
      title: 'Harvest Production Rate per houses',
      key: 'harvest_production_rate',
      url: null
    },
    {
      title: 'Recent Transactions',
      key: 'recent_transactions',
      url: '/transactions'
    },
    {
      title: 'Recent Staff Activities',
      key: 'recent_staff_activities',
      url: null
    }
  ];
  userProfile: any = [];

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'View numbers by this year up to date',
    spinnerSize: 19,
    raised: false,
    stroked: false,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    customClass: 'btn btn-primary btn-sm',
    buttonIcon: {
      fontSet: 'fa',
      fontIcon: 'fa-eye',
      inline: true
    }
  };

  from: any = null;
  to: any = null;
  created_at: any = [];
  max_date: any = new Date();

  constructor(
    private auth: AuthService,
    private datePipe: DatePipe,
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService
  ) {
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

  async ngOnInit() {
    await this.spinner.show();
    await this.auth.validateUserRole();
    await this.getDashboard();
    await this.getHarvestRate();
    await this.getHarvestStatus();
    await this.getMedicineConsumption();
    await this.getRecentTransactions();
    await this.getStaffActivities();
  }
  async changeType() {
    this.btnOps.active = true;
    this.type = this.type == 1 ? 0 : 1;
    this.btnOps.text = this.type == 0 ? 'View numbers by this year up to date' : 'View numbers by today';
    await this.ngOnInit();
    setTimeout(() => {
      this.btnOps.active = false;
    }, 1500);
  }
  async getDashboard() {
    await this.dashboardService.getDashboard(this.from, this.to).then((res: any) => {
      if (res.error == 0) {
        this.dashboard_data = res.data;
        console.log('tite', this.dashboard_data);
      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  async getFeedConsumption() {
    this.barChartLabels = [];
    this.barChartData = [];
    this.barchartvalues = [];
    await this.dashboardService.getFeedConsumption(this.from, this.to).then((res: any) => {
      console.log("getFeedConsumption", res);
      if (res.error == 0) {
        this.feed_consumption_data = res.data;
        res.data.forEach(data => {
          this.barChartLabels.push("House/Building no. " + data.house_name);
          this.barchartvalues.push(data.consumed_feeds);
        });
        this.barChartData = [
          {
            data: this.barchartvalues,
            label: 'Consumed',
            backgroundColor: '#FF9F1A',
            hoverBackgroundColor: '#FFB247',
          }
        ];
      } else {
        this.barChartData = [
          {
            data: this.barchartvalues,
            label: 'Consumed',
            backgroundColor: '#FF9F1A',
            hoverBackgroundColor: '#FFB247',
          }
        ];
      }
    }).catch(e => {
      console.log("e", e);
      this.barChartData = [
        {
          data: this.barchartvalues,
          label: 'Consumed',
          backgroundColor: '#FF9F1A',
          hoverBackgroundColor: '#FFB247',
        }
      ];
    });
  }
  async getMedicineConsumption() {
    await this.dashboardService.getMedicineConsumption(this.from, this.to).then((res: any) => {
      if (res.error == 0) {
        this.medicine_consumption_data = res.data;
      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  async getHarvestStatus() {
    await this.dashboardService.getHarvestStatus(this.from, this.to).then((res: any) => {
      if (res.error == 0) {
        this.harvest_production_status_data = res.data;
      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  async getHarvestRate() {
    this.barChartLabels2 = [];
    this.barChartData2 = [];
    this.barchartvalues2 = [];
    await this.dashboardService.getHarvestRate(this.from, this.to).then((res: any) => {
      if (res.error == 0) {
        this.harvest_rate_data = res.data;
        this.harvest_rate_data.forEach(data => {
          this.barChartLabels2.push("House/Building no. " + data.house_name);
          if (data.production_rate == 0) {
            this.barchartvalues2.push(0);
          } else {
            this.barchartvalues2.push(Number(data.production_rate));
          }
        });
        this.barChartData2 = [
          {
            data: this.barchartvalues2,
            label: 'Production Rate',
            backgroundColor: '#FF9F1A',
            hoverBackgroundColor: '#FFB247',
          }
        ];
      } else {
        this.barChartData2 = [
          {
            data: this.barchartvalues2,
            label: 'Production Rate',
            backgroundColor: '#FF9F1A',
            hoverBackgroundColor: '#FFB247',
          }
        ];
      }
    }).catch(e => {
      console.log("e", e);
      this.barChartData2 = [
        {
          data: this.barchartvalues2,
          label: 'Production Rate',
          backgroundColor: '#FF9F1A',
          hoverBackgroundColor: '#FFB247',
        }
      ];
    });
  }
  async getRecentTransactions() {
    await this.dashboardService.getRecentTransactions(this.from, this.to).then((res: any) => {
      if (res.error == 0) {
        this.recent_transactions_data = res.data;
      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  async getStaffActivities() {
    await this.dashboardService.getActivityLog(this.from, this.to).then((res: any) => {
      if (res.error == 0) {
        this.staff_activities_data = res.data;
      }
    }).catch(e => {
      console.log("e", e);
    });
    setTimeout(() => {
      this.spinner.hide();
    }, 1500);
  }
  abbreviateNumber(number) {
    var SI_POSTFIXES = ["", "k", "M", "G", "T", "P", "E"];
    var tier = Math.log10(Math.abs(number)) / 3 | 0;
    if(tier == 0) return number;
    var postfix = SI_POSTFIXES[tier];
    var scale = Math.pow(10, tier * 3);
    var scaled = number / scale;
    var formatted = scaled.toFixed(1) + '';
    if (/\.0$/.test(formatted))
      formatted = formatted.substr(0, formatted.length - 2);
    return formatted + postfix;
  }
  setMax() {

  }
  async chooseCreatedAt(e) {
    this.from = this.datePipe.transform(new Date(this.created_at.begin), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(this.created_at.end), 'yyyy-MM-dd');
    await this.ngOnInit();
  }
}
