import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FeedsMedicineManagementService } from './../../../../../services/feeds-medicine-management/feeds-medicine-management.service';
import { GeneralModalComponent } from './../../../../../components/modals/general-modal/general-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './../../../../../services/auth/auth.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-feeds-update',
  templateUrl: './feeds-update.component.html',
  styleUrls: ['./feeds-update.component.scss']
})
export class FeedsUpdateComponent implements OnInit {

  public feedForm: FormGroup;
  max_date: any = new Date();
  min_date: any = new Date();

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
    text: 'Yes, I understand - delete feed',
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
    this._route.params.subscribe(params => {
      this.getRecord(params['id']);
    });
  }
  async getRecord(id) {
    await this.feedsMedicineManagementService.getFeedRecord(id).then(res => {
      console.log("res", res);
      if (res['error'] == 0) {
        this.feedForm.controls.id.setValue(res['data']['id']);
        this.feedForm.controls.feeds.setValue(res['data']['feed']);
        this.feedForm.controls.kg_per_bag.setValue(res['data']['kg_per_bag']);
        this.feedForm.controls.pieces.setValue(res['data']['pieces']);
        this.feedForm.controls.converted.setValue(Number(res['data']['kg_per_bag']) * 1000);
        this.feedForm.controls.delivery_date.setValue(res['data']['delivery_date']);
        this.feedForm.controls.unit_price.setValue(res['data']['unit_price']);
        this.feedForm.controls.expiration_date.setValue(res['data']['expiration_date']);
        this.feedForm.controls.remarks.setValue(res['data']['remarks'] ? res['data']['remarks'] : '');
      } else {

      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  openModal(item, action): void {
    this.btnOps_delete.active = action == 'feed_delete' ? true : false;
    this.btnOps.active = action == 'feed_update' ? true : false;
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
  convertWeight(e: any) {
    let converted = Number(this.feedForm.controls.kg_per_bag.value) * 1000;
    this.feedForm.controls.converted.setValue(converted);
  }
}
