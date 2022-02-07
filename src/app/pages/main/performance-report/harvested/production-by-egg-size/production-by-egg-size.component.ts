import { Component, OnInit } from '@angular/core';
import { GeneralService } from './../../../../../services/general/general.service';
import { EggTypeService } from './../../../../../services/egg-type/egg-type.service';
import { HouseService } from './../../../../../services/house/house.service';
import { PerformanceReportService } from './../../../../../services/performance-report/performance-report.service';
import { DatePipe } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ReportProductionByEggSizeComponent } from './../../../../../components/modals/reports/report-production-by-egg-size/report-production-by-egg-size.component';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { AuthService } from './../../../../../services/auth/auth.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-production-by-egg-size',
  templateUrl: './production-by-egg-size.component.html',
  styleUrls: ['./production-by-egg-size.component.scss']
})
export class ProductionByEggSizeComponent implements OnInit {

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

  page: number = 1;
  limit: number = 10;
  limit_disabled: number = 0;

  order: any = {
    order_by_column: 'created_at',
    order_by: 'desc'
  };
  from: any = null;
  to: any = null;
  created_at: any = [];
  activity: any = [];
  showtimeago: boolean = true;
  max_date: any = new Date();

  egg_type_options: any = [];
  visible_columns: any = [];

  house_options: any = [];

  ths: any = [];
  overall_harvested_eggs: number = 0;

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
    private auth: AuthService,
    private datePipe: DatePipe,
    private eggTypeService: EggTypeService,
    private generalService: GeneralService,
    private houseService: HouseService,
    private performanceReportService: PerformanceReportService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    
  }

  async ngOnInit() {
    await this.resetDate();
    await this.spinner.show();
    await this.auth.validateUserRole();
    await this.getEggTypeList();
    await this.getHouses();
    await this.getActivity('fresh_egg_inventory_listing');
  }
  async getEggTypeList() {
    await this.eggTypeService.getList().then(res => {
      if (res['error'] == 0) {
        res['datas'].forEach((data, index) => {
          this.egg_type_options.push(data);
          this.ths.push({
            label: data.type,
            id: data.id,
            key: 'type_shortcode',
            canSort: false,
            isVisible: true,
            canToggle: true
          });
        });
        console.log('ths', this.ths);
        this.ths.forEach((data, index) => {
          this.visible_columns.push(index);
        });
        this.getList();
      }
    }).catch(e => {
      console.log(e);
    });
  }
  async getList() {
    console.log("limit", this.limit);
    await this.performanceReportService.getProductionEggSize(this.page, this.limit, this.house_id, this.from, this.to, this.order).then((res: any) => {
      if (res.error == 0) {
        console.log('res', res);
        this.totalItems = res.total_count;
        this.totalPages = res.total_page;
        this.prev_page = res.previous_page;
        this.next_page = res.next_page;
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
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
    this.chartvalues = [];
    this.chartlabels = [];
    this.barChartLabels = [];
    this.overall_harvested_eggs = 0;
    let filter = this.ths.filter(a => a.isVisible == true);
    await filter.forEach((data, index) => {
        this.chartvalues.push(0);
        let egg = this.egg_type_options.find(e => e.id == Number(data.id));
        this.chartlabels.push(egg['type']);
        this.barChartLabels.push(egg['type_shortcode']);
    });
    this.barChartData = [];
    await this.performanceReportService.getProductionEggSize(1, this.totalItems > 1 ? this.totalItems : this.limit, this.house_id, this.from, this.to, this.order).then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          data.daily_sorting_inventory.forEach((data, index) => {
            let find = this.ths.find(a => a.id == data.type_id);
            if (find.isVisible) {
              let index_of_find = filter.indexOf(find);
              this.chartvalues[index_of_find] += Number(data.sum);
              this.overall_harvested_eggs += Number(data.sum);
            }
          });
        });
        this.barChartData = [
          {
            data: this.chartvalues,
            label: 'Qty',
            backgroundColor: '#FF9F1A',
            hoverBackgroundColor: '#FFB247',
          }
        ];
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
    });
  }
  
  async getHouses() {
    await this.houseService.getAllList().then(res => {
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          this.house_options.push(data);
        });
      }
    }).catch(e => {
      console.log("e", e);
    });
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
  async chooseCreatedAt(e) {
    this.from = this.datePipe.transform(new Date(this.created_at.begin), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(this.created_at.end), 'yyyy-MM-dd');
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getList();
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
    console.log("column count", this.visible_columns.length);
    this.getGraph();
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
    this.house_id = null;
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
  async houseSelected(e) {
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getList();
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
  openModal() {
    this.btnOps.active = true;
    let dialog = this.dialog.open(ReportProductionByEggSizeComponent, {
      /* width: '400px', */
      panelClass: "scroll",
      data: {
        page: 1,
        limit: this.totalItems,
        from: this.from,
        to: this.to,
        visible_columns: this.visible_columns,
        ths: this.ths,
        house_id: this.house_id,
        items: this.items,
        barChartLabels: this.barChartLabels,
        barChartData: this.barChartData,
        overall_harvested_eggs: this.overall_harvested_eggs
      }
    });
    dialog.afterClosed().subscribe((result: any) => {
      setTimeout(() => {
        this.btnOps.active = false;
      }, 1500);
    });
  }
}
