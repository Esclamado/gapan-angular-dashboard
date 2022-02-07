import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HouseService } from './../../../../services/house/house.service';
import { FeedsMedicineConsumptionService } from './../../../../services/feeds-medicine-consumption/feeds-medicine-consumption.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralModalComponent } from './../../../../components/modals/general-modal/general-modal.component';
import { ConfirmPasswordModalComponent } from './../../../../components/modals/confirm-password-modal/confirm-password-modal.component';
import { ActivatedRoute } from "@angular/router";
import { AuthService } from './../../../../services/auth/auth.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-feeds-medicine-consumption-update',
  templateUrl: './feeds-medicine-consumption-update.component.html',
  styleUrls: ['./feeds-medicine-consumption-update.component.scss']
})
export class FeedsMedicineConsumptionUpdateComponent implements OnInit {

  monthdatetoday: any = new Date();

  public medicineConsumptionForm: FormGroup;

  house_options: any = [];

  isLoaded: boolean = false;
  order: any = {
    order_by_column: 'created_at',
    order_by: 'asc'
  };
  totalItems: number = 0;
  page: number = 1;
  prev_page: number = 0;
  next_page: number = 0;
  totalPages: number = 0;
  limit_disabled: number = 0;
  feeds_and_medicine: any = [];
  house_data: any;
  house_id: any;
  medicines: any = [];
  checkedMedicine: any = [];
  medicine: any = [/* {
    day: this.datePipe.transform(new Date(this.monthdatetoday), 'dd'),
    med: []
  } */];
  days: any = [/* {
    day: this.monthdatetoday
  } */];
  med: any = [];
  medic: any = [];
  house_details: any;
  /* disable_main_input: boolean = true; */
  daily_house_harvest_id: any;
  house_record: any;
  date_increment: any = new Date();
  date_today: any = new Date();
  feed_options: any = [];
  feed: any = [];

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Update',
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
    private formBuilder: FormBuilder,
    private houseService: HouseService,
    private location: Location,
    private feedsandmedicineConsumption: FeedsMedicineConsumptionService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public _route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.medicineConsumptionForm = this.formBuilder.group({
      house_id: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      bird_count: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(0)
        ])
      ],
      age_week: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(1)
        ])
      ],
      age_day: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(6)
        ])
      ]
    });
  }
  async ngOnInit() {
    await this.spinner.show();
    await this.auth.validateUserRole();
    await this.getHouseList();
    await this.getAllmedicines();
    await this.getAllFeeds();
    await this._route.params.subscribe(params => {
      if (params['house_id']) {
        this.medicineConsumptionForm.controls.house_id.setValue(params['house_id']);
        this.getHousedetails();
        /* this.daily_house_harvest_id = params['house_id']; */
        /* this.getDailyhouserecord(); */
      }
    });
  }
  loopDates() {
    /* this.medicines = []; */
    this.days = [];
    this.medicine = [];
    let dateToday = new Date();
    let year = dateToday.getFullYear();
    let month = dateToday.getMonth();
    let from = this.datePipe.transform(new Date(year, month, 1), 'yyyy-MM-dd');
    let to = this.datePipe.transform(new Date(year, month + 1, 0), 'yyyy-MM-dd');
    let loop = new Date(from);
    while (loop <= new Date(to)) {
      /* this.addDay(); */
      let medics = [];
      this.medicines.forEach(data => {
        medics.push({
          med_id: data.id,
          value: 0
        });
      });
      this.days.push({
        day: new Date(loop)
      });
      this.medicine.push({
        day: this.datePipe.transform(new Date(loop), 'yyyy-MM-dd'),
        med: medics,
        feed: {
          feed_id: null,
          feed_consumption: null
        }
      });
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
  }
  async getHouseList() {
    await this.houseService.getAllList().then(res => {
      if (res['error'] == 0) {
        this.house_options = res['datas'];
      } else {

      }
    }).catch(e => {
      console.log(e);
    });
  }
  goBack() {
    this.location.back();
  }
  async getFeedsandmedicineconsumption() {
    await this.loopDates();
    await this.feedsandmedicineConsumption.getList(this.order, this.house_id).then((res: any) => {
      console.log("getFeedsandmedicineconsumption", res);
      this.isLoaded = true;
      if (res.error == 0) {
        if (res.data) {
          this.house_data = res.data;
          this.house_data.forEach((data, index) => {
            this.house_details = data;
            let tindex = this.medicine.findIndex(x => x.day == this.datePipe.transform(new Date(data.created_at), 'yyyy-MM-dd'));

            if (data.medicine_ids) {
              let medicine_ids: any = data.medicine_ids.split(',');
              let medicine_values: any = data.medicine_values.split(',');
              
              medicine_ids.forEach((med, i) => {
                let mindex = this.medicines.findIndex(x => x.id == med);
                this.medicine[tindex].med[mindex].med_id = med;
                this.medicine[tindex].med[mindex].value = medicine_values[i];
              });
            }

            this.medicine[tindex].feed.feed_id = data.feed_id;
            this.medicine[tindex].feed.feed_consumption = Number(data.feed_consumption);
          });
          /* this.disable_main_input = false; */
          this.medicineConsumptionForm.controls.bird_count.setValue(this.house_data[0].bird_count/* res.house_details.current_age_of_chicken.bird_count *//* this.house_details.bird_count */);
          this.medicineConsumptionForm.controls.age_week.setValue(this.house_data[0].age_week/* res.house_details.current_age_of_chicken.age_week *//* this.house_details.age_week */);
          this.medicineConsumptionForm.controls.age_day.setValue(this.house_data[0].age_day/* res.house_details.current_age_of_chicken.age_day *//* this.house_details.age_day */);
          
          if (this.house_data.find(x => x.prepared_by != null)) {
            /* this.disable_main_input = true; */
          }
        } else {
          /* this.disable_main_input = false; */
          this.medicineConsumptionForm.controls.bird_count.setValue(res.house_details.beginning_population);
          this.medicineConsumptionForm.controls.age_week.setValue(1);
          this.medicineConsumptionForm.controls.age_day.setValue(0);
        }
      } else {
        this.house_data = [];
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
    });
    await setTimeout(() => {
      this.spinner.hide();
    }, 1500);
  }
  async getDailyhouserecord() {
    await this.feedsandmedicineConsumption.getHouserecord(this.daily_house_harvest_id).then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        this.house_record = res['data'];
        this.medicineConsumptionForm.controls.house_id.setValue(this.house_record.house_id);
        this.medicineConsumptionForm.controls.bird_count.setValue(this.house_record.bird_count);
        this.medicineConsumptionForm.controls.age_week.setValue(this.house_record.age_week);
        this.medicineConsumptionForm.controls.age_day.setValue(this.house_record.age_day);
        this.house_id = this.house_record.house_id;
      } else {
        this.house_record = [];
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
    });
  }
  async getHousedetails(e?: any) {
    this.isLoaded = false;
    this.house_id = this.medicineConsumptionForm.controls.house_id.value;
    this.medicineConsumptionForm.controls.bird_count.setValue(null);
    this.medicineConsumptionForm.controls.age_week.setValue(null);
    this.medicineConsumptionForm.controls.age_day.setValue(null);
    this.getFeedsandmedicineconsumption();
  }
  async getAllmedicines() {
    await this.feedsandmedicineConsumption.getAllmedicine().then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        res['data'].forEach(data => {
          this.medicines.push(data);
          /* this.medicine[0].med.push({
            med_id: data.id,
            value: 0
          }); */
        });
        /* this.loopDates(); */
      } else {
        this.medicines = [];
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
    });
    /* this.loopDates(); */
  }
  async getAllFeeds() {
    await this.feedsandmedicineConsumption.getAllFeeds().then(res => {
      if (res['error'] == 0) {
        this.feed_options = res['datas'];
      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  setMedvalue(e, i, x) {
    this.medicine[i].med[x].value = e;
  }
  chooseFeed(e, i) {
    this.medicine[i].feed.feed_id = e.value;
  }
  setFeedValue(e, i) {
    this.medicine[i].feed.feed_consumption = e;
  }
  openModal(action?, page?): void {
    if (action == 'form_cancel' || action == 'go_back') {
      let dialog = this.dialog.open(GeneralModalComponent, {
          width: '400px',
          data: {
            action: action,
            page: page
          }
        });
        dialog.afterClosed().subscribe(result => {
          if (result) {
            this.location.back();
          }
        });
    } else {
      this.btnOps.active = true;
      /* let medmed = [];

      this.medicine.forEach(d => {
        if (new Date(d.day) > this.date_today) {
          medmed.push(d);
        }
      }); */

      this.medic = {
        info: this.medicineConsumptionForm.value,
        medicines: this.medicine
      };
      console.log('this.medic', this.medic);
      let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
        width: '400px',
        data: {
          item: this.medic,
          action: 'medicine_add'
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
          this.btnOps.active = false;
        }, 1500);
      });
    }
  }
  checkbox(e, i, x) {
    if (!e.checked) {
      this.medicine[i].med[x].value = 0;
    }
  }
}
