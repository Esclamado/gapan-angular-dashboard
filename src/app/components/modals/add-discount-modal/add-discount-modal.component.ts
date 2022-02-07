import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPasswordModalComponent } from './../confirm-password-modal/confirm-password-modal.component';

import { OrdersService } from './../../../services/orders/orders.service';
import { FeedsMedicineManagementService } from './../../../services/feeds-medicine-management/feeds-medicine-management.service';

export interface DialogData {
  item: any;
  action: any;
};

@Component({
  selector: 'app-add-discount-modal',
  templateUrl: './add-discount-modal.component.html',
  styleUrls: ['./add-discount-modal.component.scss']
})
export class AddDiscountModalComponent implements OnInit {

  public discountForm: FormGroup;

  item: any = [];
  action: any;

  modal_title: string = 'Add Discount';
  modal_primary_button: string = 'Save';
  modal_primary_button_class: string = 'btn-primary';
  modal_message: string = 'Please enter discount amount below.';

  constructor(
    public dialogRef: MatDialogRef<AddDiscountModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private feedsMedicineManagementService: FeedsMedicineManagementService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private ordersService: OrdersService
  ) {
    this.discountForm = this.formBuilder.group({
      id: [
        null
      ],
      total_price: [
        0
      ],
      discount: [
        0
      ]
    });
  }

  ngOnInit() {
    this.item = this.data.item;
    this.action = this.data.action;
    console.log("iumte", this.item);
    console.log("action", this.action);
    if (this.item) {
      if (this.item.mode_of_payment == 1) {
        this.discountForm.controls.id.setValue(this.item.id);
        this.discountForm.controls.total_price.setValue(this.item.total_price);
        this.discountForm.controls.discount.setValue(this.item.discount);

        this.discountForm.controls.discount.setValidators([
          Validators.required,
          Validators.min(0),
          Validators.max(Number(this.item.total_price) - 1)
        ]);
      } else if (this.item.mode_of_payment == 2) {
        this.discountForm.controls.id.setValue(this.item.id);
        this.discountForm.controls.total_price.setValue(this.item.payment.balance);
        this.discountForm.controls.discount.setValue(this.item.discount);

        this.discountForm.controls.discount.setValidators([
          Validators.required,
          Validators.min(0),
          Validators.max(Number(this.item.payment.balance) - 1)
        ]);
      } else if (this.item.mode_of_payment == 3) {
        this.discountForm.controls.id.setValue(this.item.id);
        this.discountForm.controls.total_price.setValue(this.item.payment.payment);
        this.discountForm.controls.discount.setValue(this.item.discount);

        this.discountForm.controls.discount.setValidators([
          Validators.required,
          Validators.min(0),
          Validators.max(Number(this.item.payment.payment) - 1)
        ]);
      }
    }
  }
  calculateFinalPrice(e) {
    let sub = 0;
    if (this.item.mode_of_payment == 1) {
      sub = Number(this.item.total_price) - Number(this.discountForm.controls.discount.value);
    } else if (this.item.mode_of_payment == 2) {
      sub = Number(this.item.payment.balance) - Number(this.discountForm.controls.discount.value);
    } else if (this.item.mode_of_payment == 3) {
      sub = Number(this.item.payment.payment) - Number(this.discountForm.controls.discount.value);
    }
    if (sub >= 0) {
      this.discountForm.controls.total_price.setValue(sub);
    }
  }
  submit() {
    this.closeModal();
    let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
      width: '400px',
      data: {
        item: this.discountForm.value,
        action: this.action
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
  }
  async closeModal(refresh?) {
    await this.dialogRef.close(refresh);
  }
}
