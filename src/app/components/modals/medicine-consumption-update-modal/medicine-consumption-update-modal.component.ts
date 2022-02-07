import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FeedsMedicineConsumptionService } from './../../../services/feeds-medicine-consumption/feeds-medicine-consumption.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface DialogData {
  item: any;
  action: any;
};

@Component({
  selector: 'app-medicine-consumption-update-modal',
  templateUrl: './medicine-consumption-update-modal.component.html',
  styleUrls: ['./medicine-consumption-update-modal.component.scss']
})
export class MedicineConsumptionUpdateModalComponent implements OnInit {

  public medicineUpdateForm: FormGroup;

  item: any = null;
  action: any = 'update';

  modal_title: string = 'Update Medicine Consumption';
  modal_primary_button: string = 'Save Changes';
  modal_message: string = 'Are you sure you want to update medicines?';
  modal_primary_button_class: string = 'btn-primary';

  isLoaded: boolean = false;
  medicines: any = [];
  /* med_ids: any = [];
  med_values: any = []; */
  monthdatetoday: any = new Date();
  med: any = [];
  daily_house_report_id: any;

  constructor(
    public dialogRef: MatDialogRef<MedicineConsumptionUpdateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private feedsandmedicineConsumption: FeedsMedicineConsumptionService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) {
    this.medicineUpdateForm = this.formBuilder.group({
      daily_house_report_id: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      medicines:[]
    });
   }

  ngOnInit() {
    this.getAllmedicines();
    /* this.med_ids = this.data.item.medicine_ids.split(',');
    this.med_values = this.data.item.medicine_values.split(','); */
    this.medicineUpdateForm.controls.daily_house_report_id.setValue(this.data.item.id);
  }
  async getAllmedicines() {
    await this.feedsandmedicineConsumption.getAllmedicine().then(res => {
      console.log('getAllmedicinesss', res);
      this.isLoaded = true;
      if (res['error'] == 0) {
        let item_med_ids = this.data.item.medicine_ids.split(',');
        let item_med_values = this.data.item.medicine_values.split(',');
        res['data'].forEach(data => {
          this.medicines.push(data);
          this.med.push({
            med_id: data.id,
            value: 0
          });
        });
        
        item_med_ids.forEach((id, mindex) => {
          let findIndex = this.medicines.findIndex(x => x.id == id);
          this.med[findIndex].value = item_med_values[mindex];
        });

        /* res['data'].forEach(data => {
          let findIndex = item_med_ids.findIndex(x => x == data.id);
          if (findIndex >= 0) {
            console.log('findIndex', findIndex);
            this.med[findIndex].value = item_med_values[findIndex];
          }
        }); */
      } else {
        this.medicines = [];
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
    });
    console.log("med", this.med);
  }
  /* medicineChecked(e, x) {
    let pick = e + "-" + x;
    let meds = this.med.indexOf(pick);
    if (meds) {
      this.med.splice(meds, 1);
    } else {
      this.med.push(pick);
    }
    this.med.push(pick);
  } */
  setMedvalue(e, x) {
    console.log('eee',e);
    this.med[x].value = e;
  }
  /* isChecked(e, x) {
    let pick = e + "-" + x;
    let meds = this.med.includes(pick);
    return meds;
  } */
  async submit(){
    this.medicineUpdateForm.controls.medicines.setValue(this.med);
    await this.feedsandmedicineConsumption.updateMeds(this.medicineUpdateForm.value).then(res => {
      this.isLoaded = false;
      if (res['error'] == 0) {
        this.closeModal(res['message']);
      } else {
/*         this.modal_primary_button = this.action == 'create' ? 'Add House/Building' : 'Save Changes';
        this._snackBar.open(res['message'], null, {
          verticalPosition: 'top',
          announcementMessage: res['message'],
          duration: 3000
        }); */
      }
    }).catch(e => {
      this.isLoaded = false;
      console.log("e", e);
      this._snackBar.open(e, null, {
        verticalPosition: 'top',
        announcementMessage: e,
        duration: 3000
      });
    });
  }
  async closeModal(refresh?) {
    await this.dialogRef.close(refresh);
  }
  checkbox(e, x) {
    if (!e.checked) {
      this.med[x].value = 0;
    }
  }
}
