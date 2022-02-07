import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TransactionsService } from './../../../../services/transactions/transactions.service';
import { modeofpayment } from './../../../../components/datatables/filter/mode-of-payment/mode-of-payment';
import { realpaymentstatus } from './../../../../components/datatables/filter/payment-status/payment-status';
import { SessionStorageService } from "ngx-webstorage";

import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { strrandom } from 'src/app/lib/strrandom/strrandom';
import { GeneralModalComponent } from './../../../../components/modals/general-modal/general-modal.component';
import { ConfirmPasswordModalComponent } from './../../../../components/modals/confirm-password-modal/confirm-password-modal.component';
import { OrdersService } from './../../../../services/orders/orders.service';

@Component({
  selector: 'app-payment-update',
  templateUrl: './payment-update.component.html',
  styleUrls: ['./payment-update.component.scss']
})
export class PaymentUpdateComponent implements OnInit {

  public paymentForm: FormGroup;

  item: any = [];
  order_items: any = [];
  order_id: number;
  isLoaded: boolean = false;
  mode_of_payment_options: any = modeofpayment;

  payment_status_options: any = realpaymentstatus;

  userProfile: any = [];
  canChangeMode: boolean = false;

  min_date: any = new Date();
  max_date: any = new Date();
  mode_of_payment: any = null;

  /* receipt */
  receiptPhoto: any;
	croppedReceiptPhoto: any;
	isReceiptPhotoLoaded:boolean = false;
	isReceiptPhotoCropped: boolean = false;
  receiptUploadWrongFile: boolean = false;
  uploadReceiptMaxLimitReached: boolean = false;

  @ViewChild(ImageCropperComponent, {static: false}) imageCropper: ImageCropperComponent;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    public _route: ActivatedRoute,
    public session: SessionStorageService,
    private transactionsService: TransactionsService,
    protected strand: strrandom,
    private route: Router,
    private ordersService: OrdersService
  ) {
    this.max_date.setDate(this.max_date.getDate() + 7);
    this.paymentForm = this.formBuilder.group({
      id: [
        null
      ],
      mode_of_payment: [
        null
      ],
      payment_status: [
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
      ],
      receipt_photo: [
        null,
        /* Validators.compose([
          Validators.required
        ]) */
      ],
      receipt_no: [
        null,
        Validators.compose([
          Validators.required
        ])
      ]
    });
  }

  ngOnInit() {
    this.userProfile = JSON.parse(localStorage.getItem('user'));
    /* this.canChangeMode = this.userProfile.user_role_id == 5 ? false : true; */
    this._route.params.subscribe(params => {
      this.order_id = params['id'];
      this.getRecord();
    });
  }
  async getRecord() {
    await this.transactionsService.getRecord(this.order_id).then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        this.item = res['data'];
        console.log("this item", this.item);
        this.order_items = res['data']['order_items'];
        this.mode_of_payment = this.item.mode_of_payment;
        this.paymentForm.controls.id.setValue(this.item.id);
        this.paymentForm.controls.mode_of_payment.setValue(Number(this.item.mode_of_payment));
        this.paymentForm.controls.payment_status.setValue(Number(this.item.payment_status));
        this.paymentForm.controls.total_price.setValue(Number(this.item.total_price));
        /* this.changePayment(); */
        this.paymentForm.controls.payment.setValue(this.item.payment.payment);
        
        if (this.mode_of_payment == 1) {
          this.paymentForm.controls.payment.setValidators([
            Validators.required,
            Validators.min(Number(this.item.total_price)),
            Validators.max(Number(this.item.total_price))
          ]);
        } else if (this.mode_of_payment == 2) {
          if(!this.item.last_payment){
            console.log('this.item.last_payment', this.item.last_payment);
            console.log('this.mode_of_payment', this.mode_of_payment);
            this.paymentForm.controls.payment.setValidators([
              Validators.required,
              Validators.min(0),
              Validators.max(0)
            ]);
          }else{
            this.paymentForm.controls.payment.setValidators([
              Validators.required,
              Validators.min(Number(this.item.total_price)),
              Validators.max(Number(this.item.total_price))
            ]);
          }
        } else if (this.mode_of_payment == 3) {
          this.paymentForm.controls.payment.setValidators([
            Validators.required,
            Validators.min(Number(this.item.total_price) / 2),
            Validators.max(Number(this.item.total_price))
          ]);
        }
        if (!this.item.last_payment) {
          this.paymentForm.controls.balance.setValue(Number(this.item.payment.balance));
        } else {
          this.paymentForm.controls.balance.setValue(Number(this.item.total_price) - Number(this.item.last_payment.payment));
          this.paymentForm.controls.payment.setValue(null);
          this.paymentForm.controls.payment.clearValidators();
          this.paymentForm.controls.payment.setValidators([
            Validators.required,
            Validators.min(Number(this.item.total_price) - Number(this.item.last_payment.payment)),
            Validators.max(Number(this.item.total_price) - Number(this.item.last_payment.payment))
          ]);
        }
        /* this.paymentForm.controls.balance.setValue(Number(this.item.payment.balance)); */
        this.paymentForm.controls.due_date.setValue(this.item.payment.due_date);
        /* this.paymentForm.controls.receipt_no.setValue(this.item.payment.receipt_no); */

        if (this.item.total_price >= 100) {
          this.canChangeMode = true;
        } else {
          this.canChangeMode = false;
        }
      }
    }).catch(e => {
      this.isLoaded = true;
      console.log("e", e);
    });
  }
  changePayment(e?) {
    this.mode_of_payment = this.paymentForm.controls.mode_of_payment.value;
    if (this.mode_of_payment == 1) {
      this.paymentForm.controls.due_date.clearValidators();
      this.paymentForm.controls.payment.setValue(this.item.payment.payment);
      this.paymentForm.controls.balance.setValue(this.item.payment.balance);
      this.paymentForm.controls.due_date.setValue(null);
      this.paymentForm.controls.payment.setValidators([
        Validators.required,
        Validators.min(Number(this.item.total_price)),
        Validators.max(Number(this.item.total_price))
      ]);
    } else if (this.mode_of_payment == 2) { /* with credit */
      this.paymentForm.controls.payment.clearValidators();
      this.paymentForm.controls.payment.setValue(this.item.payment.payment);
      this.paymentForm.controls.balance.setValue(Number(this.item.payment.balance) + Number(this.item.payment.payment));
      this.paymentForm.controls.due_date.setValidators([
        Validators.required,
        /* Validators.min(this.min_date),
        Validators.max(this.max_date) */
      ]);
      this.paymentForm.controls.due_date.setValue(null);
      
      this.paymentForm.controls.payment.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(Number(this.item.total_price))
      ]);
    } else if (this.mode_of_payment == 3) { /* with balance */
      this.paymentForm.controls.payment.setValue(0);
      this.paymentForm.controls.balance.setValue(this.item.total_price);

      if (this.item.last_payment) {
        this.paymentForm.controls.payment.setValidators([
          Validators.required,
          Validators.min(Number(this.item.total_price) - Number(this.item.last_payment.payment)),
          Validators.max(Number(this.item.total_price) - Number(this.item.last_payment.payment))
        ]);
      } else {
        this.paymentForm.controls.payment.setValidators([
          Validators.required,
          Validators.min(Number(this.item.total_price) / 2),
          Validators.max(this.item.total_price)
        ]);
      }
      this.paymentForm.controls.due_date.setValidators([
        Validators.required,
        /* Validators.min(this.min_date),
        Validators.max(this.max_date) */
      ]);
      this.paymentForm.controls.due_date.setValue(null);
    }
  }
  async calculateRemaining(e) {
    let balance = 0;
    if (this.item.last_payment) {
      balance = (Number(this.item.total_price) - Number(this.item.last_payment.payment)) - Number(this.paymentForm.controls.payment.value);
    } else {
      balance = Number(this.paymentForm.controls.total_price.value) - Number(this.paymentForm.controls.payment.value);
    }
    if (balance < 0) {
      balance = 0;
    }
    this.paymentForm.controls.balance.setValue(balance);
  }
  enterCashAmount(e) {
    let remaining_balance = Number(this.paymentForm.controls.total_price.value) - Number(this.paymentForm.controls.payment.value);
    this.paymentForm.controls.balance.setValue(remaining_balance);
  }
  /* for receipt photo : start */
  receiptChange(event: any): void {
    console.log(event);
		let fileType = event.target.files[0].type;

		if(fileType.match('image.*')){
			if (event.target.files[0].size > 1000000) {
        this.uploadReceiptMaxLimitReached = true;
      } else {
        this.uploadReceiptMaxLimitReached = false;
        this.isReceiptPhotoLoaded = false;
        this.isReceiptPhotoCropped = false;
        this.receiptUploadWrongFile = false;
        this.receiptPhoto = event;
      }
		} else {
			this.isReceiptPhotoLoaded = true;
			this.isReceiptPhotoCropped = true;
			this.receiptUploadWrongFile = true;
			this.receiptPhoto = null;
		}
	}
	imageReceiptPhotoCropped(event: ImageCroppedEvent) {
		this.croppedReceiptPhoto = event.base64;
    this.isReceiptPhotoCropped =  true;
    let fileOfBlob = new File([event.file], this.strand.generateFileName());
    /* console.log('fileOfBlob', fileOfBlob); */
    this.paymentForm.controls.receipt_photo.setValue(fileOfBlob);
	}
	imageReceiptLoaded() {
		this.isReceiptPhotoLoaded = true;
  }
  startCrop(event: ImageCroppedEvent) {
		this.imageCropper.crop();
  }
  /* for receipt photo : end */
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
  openModal(): void {
    console.log("this.paymentForm.value", this.paymentForm.value);
    let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
      width: '400px',
      data: {
        item: this.paymentForm.value,
        action: 'payment_add'
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
    });
  }
  chooseDate(e) {
    
  }
  savePrint() {
    /* this.route.navigate(['/transactions/payments/print', this.item.id]); */
    let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
      width: '400px',
      data: {
        item: this.paymentForm.value,
        action: 'payment_add'
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.route.navigate(['/transactions/payments/print', this.item.id, 'payment']);
      }
    });
  }
}
