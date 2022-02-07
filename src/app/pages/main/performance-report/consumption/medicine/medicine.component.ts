import { Component, OnInit } from '@angular/core';
import { GeneralService } from './../../../../../services/general/general.service';
import { PerformanceReportService } from './../../../../../services/performance-report/performance-report.service';
import { AuthService } from './../../../../../services/auth/auth.service';
import { DatePipe } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { MatDialog } from '@angular/material/dialog';
import { ReportMedicineComponent } from './../../../../../components/modals/reports/report-medicine/report-medicine.component';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.scss']
})
export class MedicineComponent implements OnInit {

  medicine: any = [];

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
          labelString: 'Total Medicine Consumed',
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
          console.log("item", item);
          console.log("data", data);
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
          return "Total: " + piece + "\nOverall: " + parts.join(".") + "";
        }
      }
    },
    plugins: {
      datalabels: {
        display: false,
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

  ths: any = [];
  visible_columns: any = [];

  totalItems: number = 0;

  page: number = 1;
  limit: number = 10;
  limit_disabled: number = 0;
  order: any = {
    order_by_column: 'created_at',
    order_by: 'desc'
  };
  from: any = null;
  to: any = null;
  items: any = [];
  max_date: any = new Date();
  medicines: any = [];
  houses: any = [];
  med_id: any;
  house_id: any;
  
  created_at: any = [];

  activity: any = [];

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

  showtimeago: boolean = true;

  constructor(
    private auth: AuthService,
    private generalService: GeneralService,
    private performanceReportService: PerformanceReportService,
    private datePipe: DatePipe,
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
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
  }
  async ngOnInit() {
    await this.resetDate();
    await this.loopDates();
    await this.spinner.show();
    await this.auth.validateUserRole();
    await this.getAllmedicines();
    await this.getAllhouse();
    await this.getActivity('daily_reports_listing');
  }

  async getList() {
    await this.performanceReportService.getMedicineconsumption(this.page, this.limit, this.from, this.to, this.order, null, this.house_id, this.med_id).then((res: any) => {
      if (res.error == 0) {
        this.totalItems = res.total_count;
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        res.datas.forEach((data: any) => {
          this.items.push(data);
        });
      } else {
        this.items = [];
        this.totalItems = 0;
      }
    }).catch(e => {
      this.isLoaded = true;
      console.log("e", e);
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
    await this.performanceReportService.getMedicineconsumption(1, this.totalItems, this.from, this.to, this.order, null, this.house_id, this.med_id).then((res: any) => {
      this.isLoaded = true;
      if (res.error == 0) {
        res.datas.forEach((data: any) => {
          console.log("datad", data);
          let index_of_date = this.barChartLabels.indexOf(this.datePipe.transform(new Date(data.date), 'MM/dd'));
          console.log("index_of_date", index_of_date);
          this.charthousevalues.forEach(chv => {
            console.log("chv", chv);
            let findhome = data.house.find(x => x.id == chv.house_id);
            if (findhome/*  && findhome.medicine_volume */) {
              chv.data[index_of_date] = findhome.medicine.med_value;
              let findIfVisible = this.ths.find(x => x.key == chv.house_id);
              chv.hidden = !findIfVisible.isVisible;
            }
          });
        });
        console.log("this.charthousevalues", this.charthousevalues);
        this.barChartData = this.charthousevalues;
      } else {
        this.barChartData = this.charthousevalues;
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
      this.barChartData = this.charthousevalues;
    });
  }
    counter(i: number) {
    return new Array(i);
  }
  async getAllmedicines() {
    await this.performanceReportService.getAllmedicine().then((res: any) => {
      console.log('medicines', res);
      if (res.error == 0) {
        res.data.forEach((data: any) => {
          this.medicines.push(data);
        });
        this.med_id = this.medicines[0].id;
        this.medicine = this.medicines[0];
        this.barChartOptions.scales.yAxes[0].scaleLabel.labelString = "Total Medicine Consumed (" + this.medicine.medicine_unit.unit + ")";
      } else {
        this.medicines = [];
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
    });
  }
  async getAllhouse() {
    await this.performanceReportService.getAllList().then(res => {
      console.log('houses', res);
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          this.houses.push(data);
          this.ths.push({
            label: 'House/Bldg no. ' + data.house_name,
            key: data.id,
            canSort: false,
            isVisible: true,
            canToggle: true
          }); 
        });
        this.ths.forEach((data, index) => {
          this.visible_columns.push(index);
          this.charthousevalues.push({
            data: [],
            house_id: data.key,
            label: data.label,
            /* backgroundColor: '#FFC575',
            hoverBackgroundColor: '#FFB247', */
          });
          this.barChartLabels.forEach(() => {
            this.charthousevalues[index].data.push(0);
          });
        });
      } else {
        this.houses = [];
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
    });
    this.getList();
  }
  async changeHouse(e){
    this.isLoaded = false;
    this.houses = [];
    await this.getAllhouse();
  }
  selectMed() {
    this.isLoaded = false;
    this.medicine = this.medicines.find(x => x.id == this.med_id);
    this.barChartOptions.scales.yAxes[0].scaleLabel.labelString = "Total Medicine Consumed (" + this.medicine.medicine_unit.unit + ")";
    this.items = [];
    this.getList();
  }
  selectHouse(e){
    this.items = [];
    this.getList();
  }
  async changeColumnVisibility(e) {
    console.log("e", e);
    this.ths.forEach((data, index) => {
      data.isVisible = this.visible_columns.some(e => e == index);
    });
    this.getGraph();
  }
  async chooseCreatedAt(e) {
    this.from = this.datePipe.transform(new Date(this.created_at.begin), 'yyyy-MM-dd');
    this.to = this.datePipe.transform(new Date(this.created_at.end), 'yyyy-MM-dd');
    this.isLoaded = false;
    this.items = [];
    this.totalItems = 0;
    this.chartvalues = [];
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
    this.totalItems = 0;
    this.chartvalues = [];
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
  async gotoPage(page) {
    if (this.page != page) {
      this.isLoaded = false;
      this.page = page.pageIndex + 1;
      this.items = [];
      this.totalItems = 0;
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
  openModal() {
    this.btnOps.active = true;
    let dialog = this.dialog.open(ReportMedicineComponent, {
      panelClass: "scroll",
      data: {
        page: 1,
        limit: this.totalItems,
        from: this.from,
        to: this.to,
        order: this.order,
        ths: this.ths,
        visible_columns: this.visible_columns,
        med_id: this.med_id,
        medicine: this.medicine,
        barChartLabels: this.barChartLabels,
        charthousevalues: this.charthousevalues
      }
    });
    dialog.afterClosed().subscribe((result: any) => {
      setTimeout(() => {
        this.btnOps.active = false;
      }, 1500);
    });
  }
  getmy() {
    console.log("asdasdasd");
  }
}
