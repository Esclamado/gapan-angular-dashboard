import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EventsService } from 'angular4-events';
import { paymentattachment } from './../../datatables/filter/payment-attachment/payment-attachment';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { strrandom } from 'src/app/lib/strrandom/strrandom';
import { ConfirmPasswordModalComponent } from './../confirm-password-modal/confirm-password-modal.component';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { GeneralModalComponent } from './../general-modal/general-modal.component';
export interface DialogData {
  item: any;
  action: any;
  payment_id: any;
};

@Component({
  selector: 'app-view-payment-modal',
  templateUrl: './view-payment-modal.component.html',
  styleUrls: ['./view-payment-modal.component.scss']
})
export class ViewPaymentModalComponent implements OnInit {

  public attachmentForm: FormGroup;

  item: any = [];
  payment_id: number;
  paymentattachment_options = paymentattachment;
  type_label: any = 'Official Receipt';

  action: any = 'create';
  modal_title: string = 'Upload Signed Form';
  modal_primary_button: string = 'Save';
  modal_message: string = '';

  isLoading: boolean = false;

  photo: any;
	croppedPhoto: any;
	isPhotoLoaded:boolean = false;
	isPhotoCropped: boolean = false;
  photoUploadWrongFile: boolean = false;
  uploadMaxLimitReached: boolean = false;

  @ViewChild(ImageCropperComponent, {static: false}) imageCropper: ImageCropperComponent;

  temp_photo: any;

  constructor(
    public dialogRef: MatDialogRef<ViewPaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private events: EventsService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    protected strand: strrandom,
    protected router: Router,
    protected location: Location
  ) {
    this.attachmentForm = this.formBuilder.group({
      id: [
        ''
      ],
      type: [
        ''
      ],
      attachment_no: [
        ''
      ],
      payment_id: [
        ''
      ],
      attachment: [
        '',
        Validators.compose([
          Validators.required
        ])
      ]
    });
  }

  ngOnInit() {
    this.item = this.data.item;
    this.action = this.data.action;
    this.payment_id = this.data.payment_id;
    console.log("item", this.item);
    if (this.item) {
      this.attachmentForm.controls.id.setValue(this.item.id);
      this.attachmentForm.controls.type.setValue(Number(this.item.type));
      if (this.item.type == 1) {
        this.attachmentForm.controls.attachment_no.setValue(this.item.attachment_no);
        this.attachmentForm.controls.attachment_no.setValidators([
          Validators.required
        ]);
      }
      this.type_label = this.item.type_label;
      this.temp_photo = this.item.attachment;

      this.attachmentForm.controls.attachment.clearValidators();
    }
    this.attachmentForm.controls.payment_id.setValue(this.payment_id);
  }
  changeType(e) {
    let type = this.attachmentForm.controls.type.value;
    console.log("type", type);
    if (type == 1) {
      this.type_label = 'Official Receipt';
      this.attachmentForm.controls.attachment_no.setValidators([
        Validators.required
      ]);
      this.attachmentForm.controls.attachment_no.setValue(this.item.attachment_no);
    } else if (type == 2) {
      this.type_label = 'Payment Form';
      this.attachmentForm.controls.attachment_no.clearValidators();
      this.attachmentForm.controls.attachment_no.setValue('');
    } else if (type == 3) {
      this.type_label = 'Credit Form';
      this.attachmentForm.controls.attachment_no.clearValidators();
      this.attachmentForm.controls.attachment_no.setValue('');
    } else if (type == 4) {
      this.type_label = 'Balance Form';
      this.attachmentForm.controls.attachment_no.clearValidators();
      this.attachmentForm.controls.attachment_no.setValue('');
    }
  }
  photoChange(event: any): void {
    console.log(event);
		let fileType = event.target.files[0].type;

		if(fileType.match('image.*')){
			if (event.target.files[0].size > 1000000) {
        this.uploadMaxLimitReached = true;
      } else {
        this.uploadMaxLimitReached = false;
        this.isPhotoLoaded = false;
        this.isPhotoCropped = false;
        this.photoUploadWrongFile = false;
        this.photo = event;
        this.temp_photo = null;
      }
		} else {
			this.isPhotoLoaded = true;
			this.isPhotoCropped = true;
			this.photoUploadWrongFile = true;
			this.photo = null;
		}
	}
	imagePhotoCropped(event: ImageCroppedEvent) {
		this.croppedPhoto = event.base64;
    this.isPhotoCropped =  true;
    let fileOfBlob = new File([event.file], this.strand.generateFileName());
    /* console.log('fileOfBlob', fileOfBlob); */
    this.attachmentForm.controls.attachment.setValue(fileOfBlob);
	}
	imageLoaded() {
		this.isPhotoLoaded = true;
	}
	startCrop(event: ImageCroppedEvent) {
		this.imageCropper.crop();
  }
  openModal(): void {
    this.closeModal();
    let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
      width: '400px',
      data: {
        item: this.attachmentForm.value,
        action: this.action ? this.action : 'attachment_create'
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        /* this.reloadData(); */
        /* this.location.back(); */
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
