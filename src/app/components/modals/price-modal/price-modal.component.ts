import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EventsService } from 'angular4-events';

import { PriceManagementService } from './../../../services/price-management/price-management.service';
import { ConfirmPasswordModalComponent } from './../confirm-password-modal/confirm-password-modal.component';

export interface DialogData {
  item: any;
  action: any;
};

@Component({
  selector: 'app-price-modal',
  templateUrl: './price-modal.component.html',
  styleUrls: ['./price-modal.component.scss']
})
export class PriceModalComponent implements OnInit {

  public priceForm: FormGroup;

  item: any = [];
  action: any = 'create';

  modal_title: string = 'Update Price Details';
  modal_primary_button: string = 'Update pricing';
  modal_message: string = '';

  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PriceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private events: EventsService,
    private formBuilder: FormBuilder,
    private priceManagementService: PriceManagementService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.priceForm = this.formBuilder.group({
      id: [
        null
      ],
      type_id: [
        null
      ],
      current_price: [
        ''
      ],
      price: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(0.00)
        ])
      ]
    });
  }

  ngOnInit() {
    this.item = this.data.item;
     console.log('te', this.item);
    this.action = this.data.action;
    console.log(this.item);
    if (this.item) {
      this.priceForm.controls.id.setValue(this.item.id);
      this.priceForm.controls.type_id.setValue(this.item.egg_type_id);
      this.priceForm.controls.current_price.setValue(this.item.per_piece);
      this.modal_message = this.item.egg_type_type;
    }
  }
  async submit() {
    let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
      width: '400px',
      data: {
        item: this.priceForm.value,
        action: this.action == 'create' ? 'price_create' : 'price_update'
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this._snackBar.open(result, 'Okay', {
          verticalPosition: 'top',
          announcementMessage: result,
          duration: 3000
        });
      }
    });
    this.closeModal();
  }
  async proceedProcess() {
    this.isLoading = true;
    this.modal_primary_button = this.action == 'create' ? 'Saving...' : 'Updating...';
    await this.priceManagementService.save(this.priceForm.value).then(res => {
      this.isLoading = false;
      if (res['error'] == 0) {
        this.closeModal(res['message']);
      } else {
        this.modal_primary_button = this.action == 'create' ? 'Save price' : 'Update pricing';
        this._snackBar.open(res['message'], null, {
          verticalPosition: 'top',
          announcementMessage: res['message'],
          duration: 3000
        });
      }
    }).catch(e => {
      this.isLoading = false;
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
}
