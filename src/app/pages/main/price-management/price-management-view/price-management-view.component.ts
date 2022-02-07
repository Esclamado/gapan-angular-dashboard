import { Component, OnInit } from '@angular/core';
import { datatable } from './../../../../components/datatables/price-management-view/price-management-view';
import { PriceManagementService } from './../../../../services/price-management/price-management.service';
import { EggTypeService } from './../../../../services/egg-type/egg-type.service';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ReportPriceTrendComponent } from './../../../../components/modals/reports/report-price-trend/report-price-trend.component';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { AuthService } from './../../../../services/auth/auth.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';

@Component({
  selector: 'app-price-management-view',
  templateUrl: './price-management-view.component.html',
  styleUrls: ['./price-management-view.component.scss']
})
export class PriceManagementViewComponent implements OnInit {

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
        stacked: false,
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
        stacked: false,
        ticks: {
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
      /* align: 'start',
      labels: {
        padding: 5
      } */
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
    public _route: ActivatedRoute,
    private datePipe: DatePipe,
    private eggTypeService: EggTypeService,
    private priceManagementService: PriceManagementService,
    private dialog: MatDialog,
    private location: Location
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
    await this.auth.validateUserRole();
    await this.getEggTypeList();
    await this._route.params.subscribe((params: any) => {
      this.type = params.id;
      this.getList();
    });
  }
  async getList() {
    await this.priceManagementService.getPriceTrend(this.page, this.limit, this.type, this.from, this.to, this.order).then(res => {
      /* this.isLoaded = true; */
      if (res['error'] == 0) {
        this.totalItems = res['total_count'];
        this.totalPages = res['total_page'];
        this.prev_page = res['previous_page'];
        this.next_page = res['next_page'];
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        res['datas'].forEach(data => {
          /* data.per_piece = Number(data.price);
          data.per_case = 360 * Number(data.price);
          data.per_tray = 30 * Number(data.price); */
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
  async changeType(e) {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    let type_name = this.egg_type_options.find(x => x.id == this.type);
    this.type_name = type_name.type;
    await this.getList();
  }
  async chooseCreatedAt(e) {
    this.from = this.datePipe.transform(new Date(this.created_at.begin), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(this.created_at.end), 'yyyy-MM-dd');
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    this.chartvalues = [];
    this.lineChartLabels = [];
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
      this.totalPages = 0;
      await this.getList();
    }
  }
  async clearFilters() {
    await this.resetDate();
    this.isLoaded = false;
    this.page = 1;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    this.chartvalues = [];
    this.lineChartLabels = [];
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
  async getGraph() {
    this.chartvalues = [];
    this.lineChartData = [];
    await this.priceManagementService.getPriceTrend(1, this.totalItems, this.type, this.from, this.to, this.order).then(res => {
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
  }
  downloadModal() {
    this.btnOps.active = true;
    let dialog = this.dialog.open(ReportPriceTrendComponent, {
      /* width: '400px', */
      panelClass: "scroll",
      data: {
        page: 1,
        limit: this.totalItems,
        type: this.type,
        from: this.from,
        to: this.to,
        order: this.order,
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
  goBack() {
    this.location.back();
  }
}
