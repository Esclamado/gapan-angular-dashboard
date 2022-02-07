import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { modeofpayment } from './../../datatables/filter/mode-of-payment/mode-of-payment';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

export interface DialogData {
  item: any;
  total_price: any;
};

@Component({
  selector: 'app-transaction-create-modal',
  templateUrl: './transaction-create-modal.component.html',
  styleUrls: ['./transaction-create-modal.component.scss']
})
export class TransactionCreateModalComponent implements OnInit {

  public orderForm: FormGroup;

  item: any = [];
  action: any;
  total_price: number = 0;
  grand_total: number = 0;
  mode_of_payment_options: any = modeofpayment;
  modal_title: string = 'Choose Mode of Payment';
  modal_primary_button: string = 'Yes, proceed';
  modal_primary_button_class: string = 'btn btn-sm btn-block btn-primary';
  modal_message: string = 'Please choose a mode of payment';

  min_date: any = new Date();
  max_date: any = new Date();
  mode_of_payment: any = null;

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: this.modal_primary_button,
    spinnerSize: 19,
    raised: false,
    stroked: false,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    customClass: this.modal_primary_button_class
  };

  constructor(
    public dialogRef: MatDialogRef<TransactionCreateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.max_date.setDate(this.max_date.getDate() + 7);
    this.orderForm = this.formBuilder.group({
      mode_of_payment: [
				null
      ],
      total_price: [
        null
      ],
      payment: [
        null
      ],
      balance: [
        null
      ],
      due_date: [
        null
      ]
    });
  }

  async ngOnInit() {
    this.item = this.data.item;
    this.total_price = this.data.total_price;
    await this.item.cart.forEach(data => {
      this.grand_total += Number(data.total_price);
    });
    if (this.total_price < 100) {
      this.orderForm.controls.mode_of_payment.setValue(1);
      this.mode_of_payment = 1;
      this.orderForm.controls.payment.setValue(this.grand_total);
      this.orderForm.controls.balance.setValue(0);
    }
    this.orderForm.controls.total_price.setValue(this.grand_total);
  }
  changePayment(e) {
    this.mode_of_payment = this.orderForm.controls.mode_of_payment.value;
    if (this.mode_of_payment == 1) {
      this.orderForm.controls.due_date.clearValidators();
      this.orderForm.controls.payment.setValue(this.grand_total);
      this.orderForm.controls.balance.setValue(0);
      this.orderForm.controls.due_date.setValue(null);

      this.modal_title = 'Choose Mode of Payment';
      this.modal_message =  'Please choose a mode of payment';
      this.modal_primary_button = 'Next';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';

    } else if (this.mode_of_payment == 2) { /* with credit */
      this.modal_title = 'Credit Form';
      this.modal_message = 'Please fill up this credit form.';
      this.modal_primary_button = 'Next';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';

      this.orderForm.controls.payment.clearValidators();
      this.orderForm.controls.payment.setValue(0);
      this.orderForm.controls.balance.setValue(this.grand_total);
      this.orderForm.controls.due_date.setValidators([
        Validators.required,
        /* Validators.min(this.min_date),
        Validators.max(this.max_date) */
      ]);
      this.orderForm.controls.due_date.setValue(null);
    } else if (this.mode_of_payment == 3) { /* with balance */
      this.modal_title = 'Balance Form';
      this.modal_message = 'Please fill up this balance form.';
      this.modal_primary_button = 'Next';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';

      this.orderForm.controls.payment.setValue(0);
      this.orderForm.controls.balance.setValue(this.grand_total);
      this.orderForm.controls.payment.setValidators([
        Validators.required,
        Validators.min(Number(this.grand_total) / 2),
        Validators.max(this.grand_total)
      ]);
      this.orderForm.controls.due_date.setValidators([
        Validators.required,
        /* Validators.min(this.min_date),
        Validators.max(this.max_date) */
      ]);
      this.orderForm.controls.due_date.setValue(null);
    }
    this.btnOps.text = this.modal_primary_button;
    this.btnOps.customClass = this.modal_primary_button_class;
  }
  async calculateRemaining(e) {
    let balance = Number(this.orderForm.controls.total_price.value) - Number(this.orderForm.controls.payment.value);
    if (balance < 0) {
      balance = 0;
    }
    this.orderForm.controls.balance.setValue(balance);
  }
  async submit() {
    this.btnOps.active = true;
    let due_date = this.orderForm.controls.due_date.value;
    if (due_date) {
      this.orderForm.controls.due_date.setValue(this.datePipe.transform(new Date(due_date), 'yyyy-MM-dd'));
    }
    let orderForm = {
      customer: {
        user_id: this.item.user_id,
        customer_name: this.item.customer_name,
        number: this.item.number,
        location: this.item.location,
        request: this.item.request
      },
      payment: this.orderForm.value,
      cart: this.item.cart
    };
    this.closeModal(orderForm);
    setTimeout(() => {
      this.btnOps.active = false;
    }, 1500);
  }
  async closeModal(refresh?) {
    await this.dialogRef.close(refresh);
  }
}
