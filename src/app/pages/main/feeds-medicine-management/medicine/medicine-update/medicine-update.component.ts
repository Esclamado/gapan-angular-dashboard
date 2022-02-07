import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FeedsMedicineManagementService } from './../../../../../services/feeds-medicine-management/feeds-medicine-management.service';
import { GeneralModalComponent } from './../../../../../components/modals/general-modal/general-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MedicineUnitModalComponent } from './../../../../../components/modals/medicine-unit-modal/medicine-unit-modal.component';
import { AuthService } from './../../../../../services/auth/auth.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-medicine-update',
  templateUrl: './medicine-update.component.html',
  styleUrls: ['./medicine-update.component.scss']
})
export class MedicineUpdateComponent implements OnInit {

  public medicineForm: FormGroup;
  max_date: any = new Date();
  min_date: any = new Date();
  units: any = [];

  medicine: any = [];

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Save Changes',
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

  btnOps_delete: MatProgressButtonOptions = {
    active: false,
    text: 'Yes, I understand - delete medicine',
    spinnerSize: 19,
    raised: false,
    stroked: true,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    customClass: 'btn btn-danger btn-block',
  };

  constructor(
    private auth: AuthService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public _route: ActivatedRoute,
    private feedsMedicineManagementService: FeedsMedicineManagementService,
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    this.min_date.setDate(this.min_date.getDate() + 1);
    this.medicineForm = this.formBuilder.group({
      id: [
        null
      ],
      medicine: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      unit_id: [
        null,
        Validators.compose([
          Validators.required
        ])
      ],
      net_weight: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(0.01),
          Validators.max(9999999999)
        ])
      ],
      pieces: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(1)
        ])
      ],
      delivery_date: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      unit_price: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(0.01)
        ])
      ],
      expiration_date: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      remarks: [
        '',
        Validators.compose([
          Validators.maxLength(250)
        ])
      ],
    });
  }

  ngOnInit() {
    this.auth.validateUserRole();
    this._route.params.subscribe(params => {
      this.getRecord(params['id']);
      this.getMedicineUnits();
    });
  }
  async getRecord(id) {
    await this.feedsMedicineManagementService.getMedicineRecord(id).then((res: any) => {
      console.log("res", res);
      if (res.error == 0) {
        this.medicineForm.controls.id.setValue(res.data.id);
        this.medicineForm.controls.medicine.setValue(res.data.medicine);
        this.medicineForm.controls.unit_id.setValue(res.data.unit_id);
        this.medicineForm.controls.net_weight.setValue(res.data.net_weight);
        this.medicineForm.controls.pieces.setValue(Number(res.data.pieces));
        this.medicineForm.controls.delivery_date.setValue(res.data.delivery_date);
        this.medicineForm.controls.unit_price.setValue(res.data.unit_price);
        this.medicineForm.controls.expiration_date.setValue(res.data.expiration_date);
        this.medicineForm.controls.remarks.setValue(res.data.remarks ? res.data.remarks : '');
        this.medicine = res.data;
      } else {

      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  async getMedicineUnits() {
    await this.feedsMedicineManagementService.getMedicineUnits().then(res => {
      console.log("res", res);
      if (res['error'] == 0) {
        this.units = res['data'];
      } else {

      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  openModal(item?, action?): void {
    if (item) {
      this.btnOps_delete.active = action == 'medicine_delete' ? true : false;
      this.btnOps.active = action == 'medicine_update' ? true : false;
      let dialog = this.dialog.open(GeneralModalComponent, {
        width: '400px',
        data: {
          item: item ? item : null,
          action: action
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
          this.btnOps_delete.active = false;
        }, 1500);
      });
    } else {
      let dialog = this.dialog.open(MedicineUnitModalComponent, {
        width: '400px',
        data: {
          item: item ? item : null,
          action: action ? action : 'create'
        }
      });
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.getMedicineUnits();
          this._snackBar.open(result, 'Okay', {
            verticalPosition: 'top',
            announcementMessage: result,
            duration: 3000
          });
        }
      });
    }
    
  }
  goBack(action?, type?) {
    let dialog = this.dialog.open(GeneralModalComponent, {
      width: '400px',
      data: {
        item: null,
        action: action,
        page: type
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.location.back();
      }
    });
  }
}
