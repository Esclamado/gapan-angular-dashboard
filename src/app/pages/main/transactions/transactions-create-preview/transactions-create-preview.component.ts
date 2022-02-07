import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralModalComponent } from './../../../../components/modals/general-modal/general-modal.component';
import { modeofpayment } from './../../../../components/datatables/filter/mode-of-payment/mode-of-payment';
import { ConfirmPasswordModalComponent } from './../../../../components/modals/confirm-password-modal/confirm-password-modal.component';
import { Router } from '@angular/router';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-transactions-create-preview',
  templateUrl: './transactions-create-preview.component.html',
  styleUrls: ['./transactions-create-preview.component.scss']
})
export class TransactionsCreatePreviewComponent implements OnInit {

  my_order: any = null;
  mode_of_payment_options: any = modeofpayment;
  mode_of_payment_label: any = null;
  total_pieces: number = 0;

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Submit Order',
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
      fontIcon: 'fa-lock',
      inline: true
    }
  };

  constructor(
    private location: Location,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit() {
    this.my_order = JSON.parse(localStorage.getItem("my_order"));
    if (!this.my_order) {
      this.router.navigate(["transactions/create"]);
      this._snackBar.open('Please fill up the form to create a new order', 'Okay', {
        verticalPosition: 'top',
        announcementMessage: 'Please fill up the form to create a new order',
        duration: 3000
      });
    } else {
      let mode_of_payment_id = this.my_order.payment.mode_of_payment;
      this.mode_of_payment_label = this.mode_of_payment_options.find(e => e.value == mode_of_payment_id).label;
      let total_pieces = 0;
      this.my_order.cart.forEach(item => {
        total_pieces += Number(item.total_qty);
      });
      this.total_pieces = total_pieces;
    }
  }
  goBack(action?, page?) {
    if (page && page == 'transaction_preview') {
      this.location.back();
    } else {
      localStorage.removeItem('my_order');
      let dialog = this.dialog.open(GeneralModalComponent, {
        width: '400px',
        data: {
          item: null,
          action: action,
          page: page
        }
      });
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(["transactions"]);
        }
      });
    }
  }
  async openModal() {
    this.btnOps.active = true;
    let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
      width: '400px',
      data: {
        item: this.my_order,
        action: 'transaction_create'
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        /* this.reloadData(); */
        localStorage.removeItem('my_order');
        this.router.navigate(["transactions"]);
        this._snackBar.open(result, 'Okay', {
          verticalPosition: 'top',
          announcementMessage: result,
          duration: 3000
        });
      }
    });
    setTimeout(() => {
      this.btnOps.active = false;
    }, 1500);
  }
}
