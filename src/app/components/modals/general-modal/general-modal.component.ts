import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPasswordModalComponent } from './../confirm-password-modal/confirm-password-modal.component';

import { OrdersService } from './../../../services/orders/orders.service';
import { FeedsMedicineManagementService } from './../../../services/feeds-medicine-management/feeds-medicine-management.service';
import { FeedsMedicineConsumptionService } from './../../../services/feeds-medicine-consumption/feeds-medicine-consumption.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

export interface DialogData {
  item: any;
  action: any;
  page: any;
};

@Component({
  selector: 'app-general-modal',
  templateUrl: './general-modal.component.html',
  styleUrls: ['./general-modal.component.scss']
})
export class GeneralModalComponent implements OnInit {

  public generalForm: FormGroup;

  item: any = [];
  action: any;
  page: any;

  modal_title: string = '';
  modal_message: string = '';

  modal_secondary_button: string = 'Cancel';
  modal_secondary_button_class: string = 'btn-clear';

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: '',
    spinnerSize: 19,
    raised: false,
    stroked: false,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
  };

  constructor(
    public dialogRef: MatDialogRef<GeneralModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private feedsMedicineManagementService: FeedsMedicineManagementService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private ordersService: OrdersService,
    private feedsMedicineConsumptionService: FeedsMedicineConsumptionService
  ) {
    this.generalForm = this.formBuilder.group({
      id: [
        null
      ],
    });
  }

  ngOnInit() {
    this.item = this.data.item;
    this.action = this.data.action;
    this.page = this.data.page;
    console.log("this.item", this.item);
    console.log("this.action", this.action);
    console.log("this.page", this.page);
    if (this.item) {
      this.generalForm.controls.id.setValue(this.item.id);
    }
    if (this.action == 'go_back') {
      if (this.page == 'customer_create' || this.page == 'staff_create' || this.page == 'feed_create' || this.page == 'medicine_create' || this.page == 'transaction_create' || this.page == 'feedmedconsumption_create') {
        this.modal_title = 'Go Back';
        this.modal_message = 'Are you sure you want to go back to the list?'
        this.modal_secondary_button = 'No';
        this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
        this.btnOps.text = 'Yes';
      } else if (this.page == 'customer_update' || this.page == 'staff_update' || this.page == 'feed_update' || this.page == 'medicine_update') {
        this.modal_title = 'Go Back';
        this.modal_message = 'All changes will be discarded. Are you sure you want to go back?'
        this.modal_secondary_button = 'No';
        this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
        this.btnOps.text = 'Yes';
      } else if (this.page == 'payment_add') {
        this.modal_title = 'Go Back';
        this.modal_message = 'Are you sure you want to go back to the order details?'
        this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
        this.btnOps.text = 'Yes';
      }
    } else if (this.action == 'form_cancel') {
      if (this.page == 'feedmedconsumption_create') {
        this.modal_title = 'Add Monthly Record';
        this.modal_message = 'Are you sure you want to cancel creating a new monthly record?'
        this.modal_secondary_button = 'No';
        this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
        this.btnOps.text = 'Yes';
      }
      if (this.page == 'customer_create') {
        this.modal_title = 'Cancel New Customer';
        this.modal_message = 'Are you sure you want to cancel creating a new customer?'
        this.modal_secondary_button = 'No';
        this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
        this.btnOps.text = 'Yes';
      } else if (this.page == 'customer_update' || this.page == 'staff_update' || this.page == 'feed_update' || this.page == 'medicine_update') {
        this.modal_title = 'Cancel Update';
        this.modal_message = 'Are you sure you want to discard changes?'
        this.modal_secondary_button = 'No';
        this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
        this.btnOps.text = 'Yes';
      } else if (this.page == 'staff_create') {
        this.modal_title = 'Cancel New Staff';
        this.modal_message = 'Are you sure you want to cancel creating a new staff?'
        this.modal_secondary_button = 'No';
        this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
        this.btnOps.text = 'Yes';
      } else if (this.page == 'feed_create') {
        this.modal_title = 'Cancel New Feed';
        this.modal_message = 'Are you sure you want to cancel creating a new feed?'
        this.modal_secondary_button = 'No';
        this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
        this.btnOps.text = 'Yes';
      } else if (this.page == 'medicine_create') {
        this.modal_title = 'Cancel New Medicine';
        this.modal_message = 'Are you sure you want to cancel creating a new medicine?'
        this.modal_secondary_button = 'No';
        this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
        this.btnOps.text = 'Yes';
      } else if (this.page == 'transaction_create') {
        this.modal_title = 'Cancel New Transaction';
        this.modal_message = 'Are you sure you want to cancel creating a new transaction?'
        this.modal_secondary_button = 'No';
        this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
        this.btnOps.text = 'Yes';
      } else if (this.page == 'payment_add') {
        this.modal_title = 'Cancel Add Payment';
        this.modal_message = 'Are you sure you want to cancel adding payment?'
        this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
        this.btnOps.text = 'Yes';
      }
    } else if (this.action == 'order_approve') {
      this.modal_title = 'Approve Order';
      this.modal_message = 'Do you want to proceed in approving this order?'
    } else if (this.action == 'order_decline') {
      this.modal_title = 'Decline Order';
      this.modal_message = 'Please state the reason for declining this order.'
      this.btnOps.customClass = 'btn btn-sm btn-block btn-danger';
      this.btnOps.text = 'Next';
      this.generalForm.addControl('message', new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(250)
        ])
      ));
    } else if (this.action == 'order_cancel') {
      this.modal_title = 'Cancel Order';
      this.modal_message = 'Please state the reason for cancelling this order.'
      this.btnOps.customClass = 'btn btn-sm btn-block btn-danger';
      this.btnOps.text = 'Next';

      this.generalForm.addControl('message', new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(250)
        ])
      ));
    } else if (this.action == 'feed_save' || this.action == 'medicine_save') {
      this.modal_title = 'Save Item';
      this.modal_message = 'Do you want to save this item?'
      this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
      this.btnOps.text = 'Yes';
    } else if (this.action == 'feed_update' || this.action == 'medicine_update') {
      this.modal_title = 'Update Item';
      this.modal_message = 'Do you want to update this item?'
      this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
      this.btnOps.text = 'Yes';
    } else if (this.action == 'feed_delete' || this.action == 'medicine_delete') {
      this.modal_title = 'Delete Item';
      this.modal_message = 'Do you want to delete this item?'
      this.btnOps.customClass = 'btn btn-sm btn-block btn-danger';
      this.btnOps.text = 'Yes';
    } else if (this.action == 'logout') {
      this.modal_title = 'Logout';
      this.modal_message = 'Are you sure you want to log out?'
      this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
      this.btnOps.text = 'Yes';
    } /* else if (this.action == 'medicine_add'){
      this.modal_title = 'Add Medicine';
      this.modal_message = 'Are you sure you want to add medicine?'
      this.modal_primary_button = 'Yes';
      this.modal_primary_button_class = 'btn-primary';
    } */ else if (this.action == 'feed_add') {
      this.modal_title = 'Update Feeds';
      this.modal_message = 'Are you sure you want to update Gram/Bird Feeds?'
      this.btnOps.customClass = 'btn btn-sm btn-block btn-primary';
      this.btnOps.text = 'Yes';
    }
  }
  async submit() {
    this.btnOps.active = true;
    if (this.action == 'go_back' || this.action == 'form_cancel') {
      this.closeModal(true);
    } else if (this.action == 'order_approve' || this.action == 'order_decline' || this.action == 'order_cancel') {
      this.closeModal();
      this.openModal(this.generalForm.value, this.action);
    } else if (this.action == 'feed_save' || this.action == 'feed_update') {
      await this.feedsMedicineManagementService.saveFeed(this.item).then(res => {
        if (res['error'] == 0) {
          this.closeModal(res['message']);
        } else {
          this.openSnackBar(res['message']);
        }
      }).catch(e => {
        console.log("e", e);
        this.openSnackBar(e);
      });
    } else if (this.action == 'feed_delete') {
      await this.feedsMedicineManagementService.removeFeed(this.generalForm.value).then(res => {
        if (res['error'] == 0) {
          this.closeModal(res['message']);
        } else {
          this.openSnackBar(res['message']);
        }
      }).catch(e => {
        console.log("e", e);
        this.openSnackBar(e);
      });
    } else if (this.action == 'medicine_save' || this.action == 'medicine_update') {
      await this.feedsMedicineManagementService.saveMedicine(this.item).then(res => {
        if (res['error'] == 0) {
          this.closeModal(res['message']);
        } else {
          this.openSnackBar(res['message']);
        }
      }).catch(e => {
        console.log("e", e);
        this.openSnackBar(e);
      });
    } else if (this.action == 'medicine_delete') {
      await this.feedsMedicineManagementService.removeMedicine(this.generalForm.value).then(res => {
        if (res['error'] == 0) {
          this.closeModal(res['message']);
        } else {
          this.openSnackBar(res['message']);
        }
      }).catch(e => {
        console.log("e", e);
        this.openSnackBar(e);
      });
    } else if (this.action == 'logout') {
      this.closeModal(true);
    } /* else if(this.action == 'medicine_add'){
      await this.feedsMedicineConsumptionService.saveMed(this.item).then(res => {
        if (res['error'] == 0) {
          this.closeModal(res['message']);
        } else {
          this.openSnackBar(res['message']);
        }
      }).catch(e => {
        console.log("e", e);
        this.openSnackBar(e);
      });
    } */
    else if (this.action == 'feed_add') {
      await this.feedsMedicineConsumptionService.updateFeeds(this.item).then(res => {
        if (res['error'] == 0) {
          this.closeModal(res['message']);
        } else {
          this.openSnackBar(res['message']);
        }
      }).catch(e => {
        console.log("e", e);
        this.openSnackBar(e);
      });
    }
    setTimeout(() => {
      this.btnOps.active = false;
    }, 1500);
  }
  openModal(item, action): void {
    let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
      width: '400px',
      data: {
        item: item,
        action: action
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
  async openSnackBar(message) {
    await this._snackBar.open(message, null, {
      verticalPosition: 'top',
      announcementMessage: message,
      duration: 3000
    });
  }
}
