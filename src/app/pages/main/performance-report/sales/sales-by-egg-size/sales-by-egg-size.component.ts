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
import { ReportSalesEggComponent } from './../../../../../components/modals/reports/report-sales-egg/report-sales-egg.component';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { AuthService } from './../../../../../services/auth/auth.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-sales-by-egg-size',
  templateUrl: './sales-by-egg-size.component.html',
  styleUrls: ['./sales-by-egg-size.component.scss']
})
export class SalesByEggSizeComponent implements OnInit {
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
          labelString: 'Total no. of eggs sold',
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

  public barsChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Total Quantity',
          fontSize: 14,
          lineHeight: 4,
          fontColor: '#05172e'
        },
        ticks: {
          min: 0,
          callback: function (label, index, labels) {
            let SI_POSTFIXES = ["", "K", "M", "G", "T", "P", "E"];
            let tier = Math.log10(Math.abs(label)) / 3 | 0;
            if (tier == 0) return label;
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
      }]
    },
    tooltips: {
      callbacks: {
        title: (title, data) => {
          return null;
        },
        label: function (item, data) {
          return item.label;
        },
        footer: function (item, data) {
          if (Number(item[0].value) == 0) {
            return null;
          } else {
            let parts = item[0].value.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return "Total Amount: " + parts.join(".") + '';
          }
        }
      }
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          return null;
          /* let SI_POSTFIXES = ["", "K", "M", "G", "T", "P", "E"];
          let tier = Math.log10(Math.abs(value)) / 3 | 0;
          if(tier == 0) return value;
          let postfix = SI_POSTFIXES[tier];
          let scale = Math.pow(10, tier * 3);
          let scaled = value / scale;
          let formatted = scaled.toFixed(1) + '';
          if (/\.0$/.test(formatted))
            formatted = formatted.substr(0, formatted.length - 2);
          return formatted + postfix; */
        },
      },
    },
  };
  public barsChartLabels: Label[] = [];
  public barsChartType: ChartType = 'bar';
  public barsChartLegend = true;
  public barsChartPlugins = [pluginDataLabels];
  public barsChartData: ChartDataSets[] = [];

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
  selected_house: any = [];

  ths: any = [];

  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementId: 'printable-content',
    options: {
      filename: 'hey',
      jsPDF: {
        orientation: 'landscape',
      },
      margin: 20,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas:  { scale: 2 },
      pdfCallbackFn: this.pdfCallbackFn // to add header and footer
    }
  };

  highest_orders: any = [];
  credit_balance: any = [];
  chartvalues_balance: any = [];
  chartvalues_credit: any = [];

  overall_eggs_sold: number = 0;

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

  async ngOnInit() {
    await this.resetDate();
    await this.spinner.show();
    await this.auth.validateUserRole();
    await this.getEggTypeList();
    await this.getHouses();
    await this.getActivity('transactions_listing');
    /* this.getCreditbalance(); */
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
    await this.performanceReportService.getSalesByEggSize(this.page, this.limit, this.from, this.to, this.order).then((res: any) => {
      if (res.error == 0) {
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
    this.overall_eggs_sold = 0;
    let filter = this.ths.filter(a => a.isVisible == true);
    await filter.forEach((data, index) => {
        this.chartvalues.push(0);
        let egg = this.egg_type_options.find(e => e.id == Number(data.id));
        this.chartlabels.push(egg['type']);
        this.barChartLabels.push(egg['type_shortcode']);
    });
    this.barChartData = [];
    this.totalItems = this.totalItems == 1 ? 2 : this.totalItems;
    await this.performanceReportService.getSalesByEggSize(1, this.totalItems, this.from, this.to, this.order).then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          data.egg_types.forEach((data, index) => {
            let find = this.ths.find(a => a.id == data.id);
            if (find.isVisible) {
              let index_of_find = filter.indexOf(find);
              this.chartvalues[index_of_find] += Number(data.total);
              this.overall_eggs_sold += Number(data.total);
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
      } else {
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
      this.barChartData = [
        {
          data: this.chartvalues,
          label: 'Qty',
          backgroundColor: '#FF9F1A',
          hoverBackgroundColor: '#FFB247',
        }
      ];
    });
  }
  
  async getHouses() {
    await this.houseService.getAllList().then(res => {
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          this.house_options.push(data);
          this.selected_house.push(data.id);
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
    this.highest_orders = [];
    this.credit_balance = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getList();
    /* await this.getCreditbalance(); */
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
  async exportPdf(type: SupportedExtensions, opt?: string) {
    let that = this;
    this.exportAsConfig.type = type;
    if (opt) {
      this.exportAsConfig.options.jsPDF.orientation = opt;
    }
    let fileName = 'Report-Sales-By-Egg-Size-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {

    });
  }
  pdfCallbackFn (pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30);
    }
  }
  openModal() {
    this.btnOps.active = true;
    let dialog = this.dialog.open(ReportSalesEggComponent, {
      /* width: '400px', */
      panelClass: "scroll",
      data: {
        page: 1,
        limit: this.totalItems,
        from: this.from,
        to: this.to,
        visible_columns: this.visible_columns,
        ths: this.ths,
        order: this.order,
        egg_type_options: this.egg_type_options
      }
    });
    dialog.afterClosed().subscribe((result: any) => {
      setTimeout(() => {
        this.btnOps.active = false;
      }, 1500);
    });
  }
  async getCreditbalance() {
    this.barsChartData = [];
    this.barsChartLabels = [];
    await this.performanceReportService.getCreditBalance(this.from, this.to).then(res => {
      console.log('getCreditbalance', res);
      if (res['error'] == 0) {
        res['data'].forEach(data => {
          this.barsChartLabels.push('week: ' + data.week);
          this.chartvalues_balance.push(data.balance);
          this.chartvalues_credit.push(data.credit);
        });
        this.barsChartData = [
          {
            data: this.chartvalues_balance,
            label: 'Balance',
            backgroundColor: '#FF9F1A',
            hoverBackgroundColor: '#FFB247',
          },
          {
            data: this.chartvalues_credit,
            label: 'Credit',
            backgroundColor: '#FFC575',
            hoverBackgroundColor: '#FFB247',
          }
        ];
      } else {
        this.barsChartData = [
          {
            data: this.chartvalues_balance,
            label: 'Balance',
            backgroundColor: '#FF9F1A',
            hoverBackgroundColor: '#FFB247',
          },
          {
            data: this.chartvalues_credit,
            label: 'Credit',
            backgroundColor: '#FFC575',
            hoverBackgroundColor: '#FFB247',
          }
        ];
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
      this.barsChartData = [
        {
          data: this.chartvalues_balance,
          label: 'Balance',
          backgroundColor: '#FF9F1A',
          hoverBackgroundColor: '#FFB247',
        },
        {
          data: this.chartvalues_credit,
          label: 'Credit',
          backgroundColor: '#FFC575',
          hoverBackgroundColor: '#FFB247',
        }
      ];
    });
  }
}