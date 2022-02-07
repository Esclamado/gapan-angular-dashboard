import { Component, OnInit } from '@angular/core';
import { FeedsMedicineConsumptionService } from './../../../../services/feeds-medicine-consumption/feeds-medicine-consumption.service';
import { datatable } from './../../../../components/datatables/feeds-medicine-consumption-view/feeds-medicine-consumption-view';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { GeneralModalComponent } from './../../../../components/modals/general-modal/general-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MedicineConsumptionUpdateModalComponent } from './../../../../components/modals/medicine-consumption-update-modal/medicine-consumption-update-modal.component';
import { FeedConsumptionUpdateModalComponent } from './../../../../components/modals/feed-consumption-update-modal/feed-consumption-update-modal.component';
import { ReportMonthlyRecordComponent } from './../../../../components/modals/reports/report-monthly-record/report-monthly-record.component';
import { ExportToCsv } from 'export-to-csv';
import { AuthService } from './../../../../services/auth/auth.service';
import { ConfirmPasswordModalComponent } from './../../../../components/modals/confirm-password-modal/confirm-password-modal.component';
import { Router } from "@angular/router";
import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-feeds-medicine-consumption-view',
  templateUrl: './feeds-medicine-consumption-view.component.html',
  styleUrls: ['./feeds-medicine-consumption-view.component.scss']
})
export class FeedsMedicineConsumptionViewComponent implements OnInit {

  isLoaded: boolean = false;

  feeds_and_medicine: any = [];
  house_data: any = [];
  feedsmedicine: any = [];
  limit: number = 10;
  order: any = {
    order_by_column: 'created_at',
    order_by: 'asc'
  };
  house_id: any;

  totalItems: number = 0;
  page: number = 1;
  prev_page: number = 0;
  next_page: number = 0;
  totalPages: number = 0;

  ths: any = datatable;
  visible_columns: any = [];

  limit_disabled: number = 0;

  date: Date;
  dateCreatedat: any = [];
  dateToday: any;
  /* rowActive: boolean = false; */
  id: any = [];
  contentEditable: boolean = false;
  formdata: any = [];

  datetoday: any = new Date();
  d: any;
  isToday: boolean = false;

  can_delete: boolean = false;

  show_filter: boolean = false;
  
  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Edit Details',
    spinnerSize: 19,
    raised: false,
    stroked: false,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    customClass: 'btn btn-secondary btn-block mb-20',
    buttonIcon: {
      fontSet: 'fa',
      fontIcon: 'fa-edit',
      inline: true
    }
  };

  btnOps_delete: MatProgressButtonOptions = {
    active: false,
    text: 'Delete Record',
    spinnerSize: 19,
    raised: false,
    stroked: false,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    customClass: 'btn btn-danger btn-block',
  };

  btnOps_pdf: MatProgressButtonOptions = {
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
    customClass: 'btn btn-primary btn-block mb-20',
  };

  btnOps_csv: MatProgressButtonOptions = {
    active: false,
    text: 'Download as CSV',
    spinnerSize: 19,
    raised: false,
    stroked: false,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    customClass: 'btn btn-primary btn-block',
  };

  constructor(
    private auth: AuthService,
    private feedsandmedicineConsumption: FeedsMedicineConsumptionService,
    public _route: ActivatedRoute,
    private location: Location,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) { 
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    await this.auth.validateUserRole();
    await this._route.params.subscribe(params => {
      console.log('param',params);
      this.house_id = params['house_id'];
      this.getFeedsandmedicineconsumption();
    });
    this.d = this.datetoday.setDate(this.datetoday.getDate()/*  + 1 */);
  }
  async changeLimit(e) {
    this.isLoaded = false;
    this.feeds_and_medicine = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getFeedsandmedicineconsumption();
  }
  async gotoPage(page) {
    this.isLoaded = false;
    this.page = page;
    this.feeds_and_medicine = [];
    this.totalItems = 0;
    this.totalPages = 0;
    await this.getFeedsandmedicineconsumption();
  }
  async orderList(can_sort, order_by_column, order_by) {
    if (can_sort) {
      this.order = {
        order_by_column: order_by_column,
        order_by: order_by
      };
      this.isLoaded = false;
      this.feeds_and_medicine = [];
      this.totalItems = 0;
      this.totalPages = 0;
      await this.getFeedsandmedicineconsumption();
    }
  }
  async getFeedsandmedicineconsumption(){
    await this.feedsandmedicineConsumption.getList(/* this.page, this.limit,  */this.order, this.house_id).then((res: any) => {
      this.isLoaded = true;
      if (res.error == 0) {
        if (this.totalItems < 10) {
          this.limit_disabled = this.totalItems;
        }
        res.data.forEach(data => {
          this.feeds_and_medicine.push(data);
          this.date = new Date();
          this.date.setDate(this.date.getDate()/*  + 1 */);
          this.dateCreatedat = this.datePipe.transform(new Date(data.created_at), 'yyyy-MM-dd');
          this.dateToday = this.datePipe.transform(new Date(this.date), 'yyyy-MM-dd');
          if(this.dateToday > this.dateCreatedat){
            this.isToday = true;
          }

        });
        this.house_data = res.house_details;
        console.log("j feeds_and_medicine", this.feeds_and_medicine);
        if (res.data.find(x => x.prepared_by != null)) {
          this.can_delete = false;
        } else {
          this.can_delete = true;
        }
      } else {
        this.feeds_and_medicine = [];
        this.totalItems = 0;
      }
    }).catch(e => {
      console.log("e",e);
      this.isLoaded = true;
    });
    await setTimeout(() => {
      this.spinner.hide();
    }, 1500);
  }
  async changeColumnVisibility(e) {
    console.log(e);
    this.ths.forEach((data, index) => {
      data.isVisible = this.visible_columns.some(e => e == index);
    })
    console.log('new ths', this.ths);
  }
  goBack() {
    this.location.back();
  }
  async onRowEnter(e,id){
    e.preventDefault();
    this.formdata = {
     feed_id: id,
      feeds_bags: e.target.innerHTML
    }
    if (e.which === 13) {
      let dialog = this.dialog.open(GeneralModalComponent, {
        width: '400px',
        data: {
          item: this.formdata,
          action: 'feed_add'
        }
      });
      dialog.afterClosed().subscribe(result => {
        if (result) {
          /* this.location.back(); */
          this.reloadData();
          window.getSelection().removeAllRanges();
          this._snackBar.open(result, 'Okay', {
            verticalPosition: 'top',
            announcementMessage: result,
            duration: 3000
          });
        }
      });
/*       await this.feedsandmedicineConsumption.updateFeeds(formdata).then(res => {
        this.isLoaded = true;
        if (res['error'] == 0) {
          window.getSelection().removeAllRanges();
        }
      }).catch(e => {
        console.log("e", e);
        this.isLoaded = true;
      }); */
    }
  }
  async updateMed(){
    console.log('house_data', this.house_data);
    console.log('daily_house_report', this.feeds_and_medicine);
  }
  async reloadData() {
    this.isLoaded = false;
    this.feeds_and_medicine = [];
    await this.getFeedsandmedicineconsumption();
  }
  openModal(data, type?) {
    /* let date = this.datePipe.transform(new Date(this.d), 'yyyy-MM-dd');
    let date2 = this.datePipe.transform(new Date(data.created_at), 'yyyy-MM-dd');
    if(date > date2){

    }else{ */
      if (type == 'feed') {
        let dialog = this.dialog.open(FeedConsumptionUpdateModalComponent, {
          width: '400px',
          data: {
            item: data,
            action: 'feed_update'
          }
        });
        dialog.afterClosed().subscribe(result => {
          if (result) {
            this.reloadData();
            /* this.location.back(); */
            this._snackBar.open(result, 'Okay', {
              verticalPosition: 'top',
              announcementMessage: result,
              duration: 3000
            });
          }
        });
      } else {
        let dialog = this.dialog.open(MedicineConsumptionUpdateModalComponent, {
          width: '800px',
          data: {
            item: data,
            action: 'medicine_update'
          }
        });
        dialog.afterClosed().subscribe(result => {
          if (result) {
            this.reloadData();
            /* this.location.back(); */
            this._snackBar.open(result, 'Okay', {
              verticalPosition: 'top',
              announcementMessage: result,
              duration: 3000
            });
          }
        });
      }
    /* } */
  }
  openPdf() {
    this.btnOps_pdf.active = true;
    let dialog = this.dialog.open(ReportMonthlyRecordComponent, {
      /* width: '400px', */
      panelClass: "scroll",
      data: {
        visible_columns: this.visible_columns,
        ths: this.ths,
        house_id: this.house_id,
        order: this.order,
        house_data: this.house_data,
        feeds_and_medicine: this.feeds_and_medicine
      }
    });
    dialog.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.btnOps_pdf.active = false
      }, 1500);
    });
  }
  async exportToCsv() {
    this.btnOps_csv.active = true;
    let datas = [];
    this.feeds_and_medicine.forEach(feeds_medicine => {

      let age_string = feeds_medicine.age_week > 1 ? feeds_medicine.age_week+' weeks, ' : feeds_medicine.age_week+' week, ';
      age_string += feeds_medicine.age_day > 1 ? feeds_medicine.age_day + ' days' : feeds_medicine.age_day+' day';

      let medicine_string = '';

      if (feeds_medicine.medicine_name) {
        feeds_medicine.medicine_name.forEach((med, m) => {
          medicine_string += med.medicine + ' (' + med.medicine_value + ' ' + med.medicine_unit.unit + ')';
          medicine_string += m < feeds_medicine.medicine_name.length - 1 ? ', ' : '';
        });
      }
      datas.push({
        'Day': this.datePipe.transform(new Date(feeds_medicine.created_at), 'yyyy-MM-dd'),
        'Age': age_string,
        'Mortality': feeds_medicine.mortality,
        'Mortality Rate %': feeds_medicine.mortality_rate + ' %',
        'Cull': feeds_medicine.cull,
        'End Population': feeds_medicine.end_bird_population,
        'Egg Production': feeds_medicine.real_egg_count,
        'Production Rate %': feeds_medicine.production_rate + ' %',
        'Grams/Bird': feeds_medicine.feed_info ? feeds_medicine.feed_info.feed : '' + ' (' + feeds_medicine.feed_consumption + ' g)',
        'Feeds/Bags': feeds_medicine.feeds ? feeds_medicine.feeds.string : '',
        'Recommended Feeds (g)': feeds_medicine.feed_info ? feeds_medicine.feed_info.feed : '' + ' (' + feeds_medicine.rec_feed_consumption+ ' g)',
        'Recommended Feeds/Bags': feeds_medicine.req_feeds ? feeds_medicine.req_feeds.string : '',
        'Medication': medicine_string
      });
    });
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title:  'Feeds-And-Medicine-Consumption-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename: 'Feeds-And-Medicine-Consumption-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(datas);
    setTimeout(() => {
      this.btnOps_csv.active = false
    }, 1500);
  }
  async removeRecord() {
    this.btnOps_delete.active = true;
    let item = {
      date_today: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      house_id: this.house_id
    };
    let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
      width: '400px',
      data: {
        item: item,
        action: 'monthly_record_remove'
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        /* this.reloadData(); */
        this.location.back();
        this._snackBar.open(result, 'Okay', {
          verticalPosition: 'top',
          announcementMessage: result,
          duration: 3000
        });
      }
      setTimeout(() => {
        this.btnOps_delete.active = false;
      }, 1500);
    });
  }
  async routerLink(page, id) {
    this.btnOps.active = true;
    this.router.navigate([page, id]).then(() => {
      setTimeout(() => {
        this.btnOps.active = false;
      }, 1500);
    });
  }
}
