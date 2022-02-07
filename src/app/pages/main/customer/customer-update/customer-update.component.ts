import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmPasswordModalComponent } from './../../../../components/modals/confirm-password-modal/confirm-password-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from "@angular/router";
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { strrandom } from 'src/app/lib/strrandom/strrandom';
import { CustomerService } from './../../../../services/customer/customer.service';
import { StaffService } from './../../../../services/staff/staff.service';
import { GeneralModalComponent } from './../../../../components/modals/general-modal/general-modal.component';
import { AuthService } from './../../../../services/auth/auth.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.scss']
})
export class CustomerUpdateComponent implements OnInit {

  public userForm: FormGroup;
  customer_type_options: any = [];

  profilePhoto: any;
	croppedprofilePhoto: any;
	isProfileImageLoaded:boolean = false;
	isProfilePhotoCropped: boolean = false;
  profileUploadWrongFile: boolean = false;
  uploadMaxLimitReached: boolean = false;

  @ViewChild(ImageCropperComponent, {static: false}) imageCropper: ImageCropperComponent;
  @ViewChild('file_upload', {static: false}) file_upload: ElementRef;

  btnOps_password: MatProgressButtonOptions = {
    active: false,
    text: 'Generate',
    spinnerSize: 19,
    raised: false,
    stroked: false,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    customClass: 'btn btn-primary'
  };

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
    customClass: 'btn btn-primary btn-block'
  };

  uploadBtnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Choose a file',
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
    text: 'Yes, I understand - delete user',
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
    public _route: ActivatedRoute,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private location: Location,
    private staffService: StaffService,
    protected strand: strrandom,
    protected authService: AuthService
  ) {
    this.userForm = this.formBuilder.group({
      id: [
        null
      ],
      role: [
        3
      ],
      first_name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ],
      last_name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ],
      customer_type_id: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      number: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.maxLength(10),
          Validators.minLength(10)
        ])
      ],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
          Validators.maxLength(50),
          Validators.minLength(6)
        ])
      ],
      password: [
        ''
      ],
      location: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(60)
        ])
      ],
      photo: []
    });
  }
  ngOnInit() {
    this._route.params.subscribe(params => {
      this.getCustomerTypes();
      this.getRecord(params['id']);
    });
  }
  async getCustomerTypes() {
    await this.customerService.getCustomerTypes().then(res => {
      if (res['error'] == 0) {
        this.customer_type_options = res['datas'];
      }
    }).catch(e => {
      console.log(e);
    });
  }
  async getRecord(id) {
    await this.staffService.getProfile(id).then(res => {
      if (res['error'] == 0) {
        if (res['data']['profile_picture']) {
          this.profilePhoto = res['data']['profile_picture'];
        }
        this.userForm.controls.id.setValue(res['data']['id']);
        this.userForm.controls.first_name.setValue(res['data']['profile_first_name']);
        this.userForm.controls.last_name.setValue(res['data']['profile_last_name']);
        this.userForm.controls.customer_type_id.setValue(res['data']['customer_type_id']);
        this.userForm.controls.number.setValue(res['data']['contact_number']);
        this.userForm.controls.email.setValue(res['data']['email']);
        this.userForm.controls.location.setValue(res['data']['address_address']);
      } else {

      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  openModal(item: any, action: any): void {
    this.btnOps_delete.active = action == 'user_delete' ? true : false;
    this.btnOps.active = action == 'user_update' ? true : false;
    let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
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
        if (action == 'user_delete') {
          this.location.back();
        }
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
  fileChange(event: any): void {
    console.log(event);
		let fileType = event.target.files[0].type;

		if(fileType.match('image.*')){
			if (event.target.files[0].size > 1000000) {
        this.uploadMaxLimitReached = true;
      } else {
        this.uploadMaxLimitReached = false;
        this.isProfileImageLoaded = false;
        this.isProfilePhotoCropped = false;
        this.profileUploadWrongFile = false;
        this.profilePhoto = event;
      }
		} else {
			this.isProfileImageLoaded = true;
			this.isProfilePhotoCropped = true;
			this.profileUploadWrongFile = true;
			this.profilePhoto = null;
		}
	}

	imageProfilePhotoCropped(event: ImageCroppedEvent) {
		this.croppedprofilePhoto = event.base64;
    this.isProfilePhotoCropped =  true;
    let fileOfBlob = new File([event.file], this.strand.generateFileName());
    /* console.log('fileOfBlob', fileOfBlob); */
    this.userForm.controls.photo.setValue(fileOfBlob);
	}

	imageProfileLoaded() {
		this.isProfileImageLoaded = true;
	}

	startCrop(event: ImageCroppedEvent) {
		this.imageCropper.crop();
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
  generatePassword() {
    this.btnOps_password.active = true;
    console.log(this.userForm.value);
    this.authService.generate(this.userForm.value).then(res => {
      if (res['error'] == 0) {
        this.userForm.controls.password.setValue(res['data']);
        /* console.log('res', res); */
      }
    }).catch(e => {
      console.log(e);
    });
    setTimeout(() => {
      this.btnOps_password.active = false;
    }, 1500);
  }
  chooseFile() {
    this.file_upload.nativeElement.click();
  }
}
