import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralModalComponent } from './../../../../../components/modals/general-modal/general-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedsMedicineManagementService } from './../../../../../services/feeds-medicine-management/feeds-medicine-management.service';
import { MedicineUnitModalComponent } from './../../../../../components/modals/medicine-unit-modal/medicine-unit-modal.component';
import { AuthService } from './../../../../../services/auth/auth.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-medicine-create',
  templateUrl: './medicine-create.component.html',
  styleUrls: ['./medicine-create.component.scss']
})
export class MedicineCreateComponent implements OnInit {
  
  public medicineForm: FormGroup;
  max_date: any = new Date();
  min_date: any = new Date();
  
  units: any = [];

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Add medicine',
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
      fontIcon: 'fa-plus',
      inline: true
    }
  };

  constructor(
    private auth: AuthService,
    private feedsMedicineManagementService: FeedsMedicineManagementService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
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
    this.getMedicineUnits();
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
    this.btnOps.active = true;
    if (item) {
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
          this._snackBar.open(result['message'], 'Okay', {
            verticalPosition: 'top',
            announcementMessage: result['message'],
            duration: 3000
          });
          this.medicineForm.controls.unit_id.setValue(result['data']);
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
