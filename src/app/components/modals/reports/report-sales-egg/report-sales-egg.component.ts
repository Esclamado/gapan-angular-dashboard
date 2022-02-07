import { Component, OnInit, Inject } from '@angular/core';
import { GeneralService } from './../../../../services/general/general.service';
import { EggTypeService } from './../../../../services/egg-type/egg-type.service';
import { HouseService } from './../../../../services/house/house.service';
import { PerformanceReportService } from './../../../../services/performance-report/performance-report.service';
import { DatePipe } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { MatDialog } from '@angular/material/dialog';
import { ReportProductionByEggSizeComponent } from './../../../../components/modals/reports/report-production-by-egg-size/report-production-by-egg-size.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

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
  egg_type_options: any
};

@Component({
  selector: 'app-report-sales-egg',
  templateUrl: './report-sales-egg.component.html',
  styleUrls: ['./report-sales-egg.component.scss']
})
export class ReportSalesEggComponent implements OnInit {

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

  chartvalues: any = [];
  chartlabels: any = [];

  isLoaded: boolean = false;
  items: any = [];
  
  prev_page: number = 0;
  next_page: number = 0;
  totalPages: number = 0;

  page: number = 1;
  limit: number = 10;
  limit_disabled: number = 0;

  order: any = {
    order_by_column: 'id',
    order_by: 'asc'
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
    public dialogRef: MatDialogRef<ReportSalesEggComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private datePipe: DatePipe,
    private eggTypeService: EggTypeService,
    private generalService: GeneralService,
    private houseService: HouseService,
    private performanceReportService: PerformanceReportService,
    private router: Router,
    private exportAsService: ExportAsService,
    private dialog: MatDialog,
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
    this.egg_type_options = this.data.egg_type_options;
    await this.getList();
  }
  async getList() {
    await this.performanceReportService.getSalesByEggSize(this.page, this.limit, this.from, this.to, this.order).then((res: any) => {
      if (res.error == 0) {
        res.datas.forEach(data => {
          this.items.push(data);
        });
      } else {
        this.items = [];
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
    this.limit = this.limit == 1 ? 2 : this.limit;
    await this.performanceReportService.getSalesByEggSize(1, this.limit, this.from, this.to, this.order).then(res => {
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
    let fileName = 'Report-Sales-By-Egg-Size-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
      setTimeout(() => {
        this.btnOps.active = false;
        this.dialogRef.close();
      }, 1500);
    });
  }
}
