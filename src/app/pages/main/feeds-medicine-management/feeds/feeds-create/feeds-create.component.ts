import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralModalComponent } from './../../../../../components/modals/general-modal/general-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './../../../../../services/auth/auth.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-feeds-create',
  templateUrl: './feeds-create.component.html',
  styleUrls: ['./feeds-create.component.scss']
})
export class FeedsCreateComponent implements OnInit {

  public feedForm: FormGroup;
  max_date: any = new Date();
  min_date: any = new Date();

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Add feed',
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
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    this.min_date.setDate(this.min_date.getDate() + 1);
    this.feedForm = this.formBuilder.group({
      id: [
        null
      ],
      feeds: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      kg_per_bag: [
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
      converted: [
        ''
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
  }
  convertWeight(e: any) {
    let converted = Number(this.feedForm.controls.kg_per_bag.value) * 1000;
    this.feedForm.controls.converted.setValue(converted);
  }
  openModal(item, action): void {
    this.btnOps.active = true;
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
