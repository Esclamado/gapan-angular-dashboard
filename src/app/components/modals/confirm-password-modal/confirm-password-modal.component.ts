import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OrdersService } from './../../../services/orders/orders.service';
import { UserService } from './../../../services/user/user.service';
import { EventsService } from 'angular4-events';
import { CustomerService } from './../../../services/customer/customer.service';
import { PriceManagementService } from './../../../services/price-management/price-management.service';
import { PaymentService } from './../../../services/payment/payment.service';
import { FeedsMedicineConsumptionService } from './../../../services/feeds-medicine-consumption/feeds-medicine-consumption.service';
import { EggTypeService } from './../../../services/egg-type/egg-type.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

export interface DialogData {
  item: any;
  action: any;
};

@Component({
  selector: 'app-confirm-password-modal',
  templateUrl: './confirm-password-modal.component.html',
  styleUrls: ['./confirm-password-modal.component.scss']
})
export class ConfirmPasswordModalComponent implements OnInit {

  public confirmPasswordForm: FormGroup;

  item: any = [];
  action: any;

  modal_title: string = '';
  modal_primary_button: string = '';
  modal_primary_button_class: string = '';
  modal_message: string = '';

  show_password: boolean = false;

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Submit',
    spinnerSize: 19,
    raised: false,
    stroked: false,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    customClass: 'btn btn-primary btn-block'
  };

  constructor(
    public dialogRef: MatDialogRef<ConfirmPasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private ordersService: OrdersService,
    private priceManagementService: PriceManagementService,
    private userService: UserService,
    private events: EventsService,
    private customerService: CustomerService,
    private paymentService: PaymentService,
    private feedsMedicineConsumptionService: FeedsMedicineConsumptionService,
    private eggTypeService: EggTypeService
  ) {
    this.confirmPasswordForm = this.formBuilder.group({
      id: [
        null
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8)
        ])
      ]
    });
  }

  ngOnInit() {
    this.item = this.data.item;
    this.action = this.data.action;

    console.log("item", this.item);
    console.log("action", this.action);
    this.confirmPasswordForm.controls.id.setValue(this.item.id);
    if (this.action == 'order_approve') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To approve this order, please enter password below for validation:'
      this.modal_primary_button = 'Yes, proceed';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';
    } else if (this.action == 'payment_approve') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To approve this request, please enter password below for validation:'
      this.modal_primary_button = 'Yes, proceed';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';
    } else if (this.action == 'order_decline') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To decline this order, please enter password below for validation:'
      this.modal_primary_button = 'Yes, proceed';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';
    } else if (this.action == 'order_cancel') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To cancel this order, please enter password below for validation:'
      this.modal_primary_button = 'Yes, proceed';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';
    } else if (this.action == 'user_add') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To add this new customer profile, please enter password below for validation:';
      if (this.item.role != 3) {
        this.modal_message = 'To add this new staff profile, please enter password below for validation:';
      }
      this.modal_primary_button = 'Submit';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';
    } else if (this.action == 'user_update') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To update customer profile, please enter password below for validation:';
      if (this.item.role != 3) {
        this.modal_message = 'To update staff profile, please enter password below for validation:';
      }
      this.modal_primary_button = 'Submit';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';
    } else if (this.action == 'user_delete') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To delete this customer profile, please enter password below for validation:';
      if (this.item.role != 3) {
        this.modal_message = 'To delete this staff profile, please enter password below for validation:';
      }
      this.modal_primary_button = 'Delete user';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-danger';
    } else if (this.action == 'transaction_create') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To submit a new order, please enter password below for validation:';
      this.modal_primary_button = 'Submit order';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';
    } else if (this.action == 'payment_add') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To save this payment, please enter password below for validation:';
      this.modal_primary_button = 'Submit';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';
    } else if (this.action == 'price_create' || this.action == 'price_update') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To save this price, please enter password below for validation:';
      this.modal_primary_button = 'Save';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';
    } else if (this.action == 'attachment_create') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To save this attachment, please enter password below for validation:';
      this.modal_primary_button = 'Save';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';
    } else if (this.action == 'attachment_update') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To update this attachment, please enter password below for validation:';
      this.modal_primary_button = 'Update';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';
    } else if (this.action == 'attachment_delete') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To delete this attachment, please enter password below for validation:';
      this.modal_primary_button = 'Delete';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-danger';
    } else if (this.action == 'add_discount') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To add discount, please enter password below for validation:';
      this.modal_primary_button = 'Save';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';
    } else if (this.action == 'medicine_add') {
      this.modal_title = 'Add Monthly Record';
      this.modal_message = 'Are you sure you want to add this monthly record?'
      this.modal_primary_button = 'Yes';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';
    } else if (this.action == 'egg_create') {
      this.modal_title = 'Add New Egg Size';
      this.modal_message = 'To add a new egg size, please enter password below for validation:'
      this.modal_primary_button = 'Yes';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-primary';
    } else if (this.action == 'monthly_record_remove') {
      this.modal_title = 'Enter Your Password';
      this.modal_message = 'To delete this attachment, please enter password below for validation:'
      this.modal_primary_button = 'Delete';
      this.modal_primary_button_class = 'btn btn-sm btn-block btn-danger';
    }
    this.btnOps.text = this.modal_primary_button;
    this.btnOps.customClass = this.modal_primary_button_class;
  }
  async submit() {
    this.btnOps.active = true;
    await this.userService.confirmPassword(this.confirmPasswordForm.value).then(res => {
      if (res['error'] == 0) {
        this.proceedAction();
      } else {
        this.openSnackBar(res['message']);
      }
    }).catch(e => {
      console.log("e", e);
      this.openSnackBar(e);
      setTimeout(() => {
        this.btnOps.active = false;
      }, 1500);
    });
  }
  async proceedAction() {
    /* this.btnOps.active = true; */
    if (this.action == 'order_approve' || this.action == 'order_decline' || this.action == 'payment_approve' || this.action == 'order_cancel') {
      await this.ordersService.save(this.item, this.action).then(res => {
        if (res['error'] == 0) {
          this.closeModal(res['message']).then(() => {
            this.events.publish('order_refresh', 1);
          });
        } else {
          this.openSnackBar(res['message']);
          this.closeModal();
        }
      }).catch(e => {
        console.log(e);
        this.openSnackBar(e);
        this.closeModal();
      });
    } else if (this.action == 'user_add') {
      await this.userService.saveUser(this.item).then(res => {
        if (res['error'] == 0) {
          this.closeModal(res['message']);
        } else {
          this.openSnackBar(res['message']);
          this.closeModal();
        }
      }).catch(e => {
        console.log(e);
        this.openSnackBar(e);
        this.closeModal();
      });
    } else if (this.action == 'user_update') {
      await this.userService.updateUser(this.item).then(res => {
        if (res['error'] == 0) {
          this.closeModal(res['message']);
        } else {
          this.openSnackBar(res['message']);
          this.closeModal();
        }
      }).catch(e => {
        console.log(e);
        this.openSnackBar(e);
        this.closeModal();
      });
    } else if (this.action == 'user_delete') {
      if (this.item.role != 3) {
        await this.userService.remove(this.item).then(res => {
          if (res['error'] == 0) {
            this.closeModal(res['message']);
          } else {
            this.openSnackBar(res['message']);
            this.closeModal();
          }
        }).catch(e => {
          console.log(e);
          this.openSnackBar(e);
          this.closeModal();
        });
      } else {
        await this.customerService.remove(this.item).then(res => {
          if (res['error'] == 0) {
            this.closeModal(res['message']);
          } else {
            this.openSnackBar(res['message']);
            this.closeModal();
          }
        }).catch(e => {
          console.log(e);
          this.openSnackBar(e);
          this.closeModal();
        });
      }
    } else if (this.action == 'transaction_create') {
      await this.ordersService.save(this.item, this.action).then(res => {
        if (res['error'] == 0) {
          this.closeModal(res['message']);
        } else {
          this.openSnackBar(res['message']);
          this.closeModal();
        }
      }).catch(e => {
        console.log("e", e);
        this.openSnackBar(e);
        this.closeModal();
      });
    } else if (this.action == 'payment_add') {
      await this.ordersService.savePayment(this.item).then(res => {
        if (res['error'] == 0) {
          this.closeModal(res['message']).then(() => {
            this.events.publish('order_refresh', 1);
          });
        } else {
          this.openSnackBar(res['message']);
          this.closeModal();
        }
      }).catch(e => {
        console.log(e);
        this.openSnackBar(e);
        this.closeModal();
      });
    } else if (this.action == 'price_create' || this.action == 'price_update') {
      console.log('tite', this.item);
      await this.priceManagementService.save(this.item).then(res => {
       
        if (res['error'] == 0) {
          this.closeModal(res['message']).then(() => {
            this.events.publish('price_refresh', 1);
          });
        } else {
          this.openSnackBar(res['message']);
          this.closeModal();
        }
      }).catch(e => {
        console.log(e);
        this.openSnackBar(e);
        this.closeModal();
      });
    } else if (this.action == 'attachment_create' || this.action == 'attachment_update') {
      await this.paymentService.save(this.item).then(res => {
        if (res['error'] == 0) {
          this.events.publish('attachments_refresh', 1);
          this.closeModal(res['message']);
        } else {
          this.openSnackBar(res['message']);
          this.closeModal();
        }
      }).catch(e => {
        console.log(e);
        this.openSnackBar(e);
        this.closeModal();
      });
    } else if (this.action == 'attachment_delete') {
      await this.paymentService.delete(this.item).then(res => {
        if (res['error'] == 0) {
          this.events.publish('attachments_refresh', 1);
          this.closeModal(res['message']);
        } else {
          this.openSnackBar(res['message']);
          this.closeModal();
        }
      }).catch(e => {
        console.log(e);
        this.openSnackBar(e);
        this.closeModal();
      });
    } else if (this.action == 'add_discount') {
      await this.paymentService.saveDiscount(this.item).then(res => {
        if (res['error'] == 0) {
          this.events.publish('order_refresh', 1);
          this.closeModal(res['message']);
        } else {
          this.openSnackBar(res['message']);
          this.closeModal();
        }
      }).catch(e => {
        console.log(e);
        this.openSnackBar(e);
        this.closeModal();
      })
    } else if(this.action == 'medicine_add'){
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
    } else if(this.action == 'egg_create'){
      await this.eggTypeService.save(this.item).then(res => {
        if (res['error'] == 0) {
          this.closeModal(res['message']);
        } else {
          this.openSnackBar(res['message']);
        }
      }).catch(e => {
        console.log("e", e);
        this.openSnackBar(e);
      });
    } else if (this.action == 'monthly_record_remove') {
      console.log("this.item", this.item);
      await this.feedsMedicineConsumptionService.removeRecord(this.item).then((res: any) => {
        if (res.error == 0) {
          this.closeModal(res.message);
        } else {
          this.openSnackBar(res.message);
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
  showPassword() {
    this.show_password = !this.show_password;
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
