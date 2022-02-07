import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ConfirmPasswordModalComponent } from './../../../../components/modals/confirm-password-modal/confirm-password-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { staffroleoptions } from './../../../../components/datatables/filter/staff-role/staff-role';
import { ActivatedRoute } from "@angular/router";
import { StaffService } from './../../../../services/staff/staff.service';

import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { strrandom } from 'src/app/lib/strrandom/strrandom';

import { GeneralModalComponent } from './../../../../components/modals/general-modal/general-modal.component';
import { AuthService } from './../../../../services/auth/auth.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-staff-update',
  templateUrl: './staff-update.component.html',
  styleUrls: ['./staff-update.component.scss']
})
export class StaffUpdateComponent implements OnInit {

  public userForm: FormGroup;

  roles: any = staffroleoptions;

  profilePhoto: any;
	croppedprofilePhoto: any;
	isProfileImageLoaded:boolean = false;
	isProfilePhotoCropped: boolean = false;
  profileUploadWrongFile: boolean = false;
  uploadMaxLimitReached: boolean = false;

  @ViewChild(ImageCropperComponent, {static: false}) imageCropper: ImageCropperComponent;
  @ViewChild('file_upload', {static: false}) file_upload: ElementRef;

  user_info: any = [];
  user_logged_in: any = [];

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

  constructor(
    public _route: ActivatedRoute,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private location: Location,
    private staffService: StaffService,
    protected strand: strrandom,
    protected auth: AuthService
  ) {
    this.userForm = this.formBuilder.group({
      id: [
        null
      ],
      role: [
        '',
        Validators.compose([
          Validators.required
        ])
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
      username: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ],
      password: [
        ''
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
      location: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(60)
        ])
      ],
      photo: []
    });
    this.user_logged_in = JSON.parse(localStorage.getItem("user"));
  }
  ngOnInit() {
    this.auth.validateUserRole();
    this._route.params.subscribe(params => {
      this.getRecord(params['id']);
    });
  }
  async getRecord(id) {
    await this.staffService.getProfile(id).then(res => {
      if (res['error'] == 0) {
        this.user_info = res['data'];
        if (this.user_info.profile_picture) {
          this.profilePhoto = this.user_info.profile_picture;
        }
        this.userForm.controls.id.setValue(this.user_info.id);
        this.userForm.controls.role.setValue(Number(this.user_info.user_role_id));
        this.userForm.controls.first_name.setValue(this.user_info.profile_first_name);
        this.userForm.controls.last_name.setValue(this.user_info.profile_last_name);
        this.userForm.controls.number.setValue(this.user_info.contact_number);
        this.userForm.controls.username.setValue(this.user_info.username);
        this.userForm.controls.location.setValue(this.user_info.address_address);
        if (this.user_info.user_role_id == 4 || this.user_info.user_role_id == 5) {
          this.userForm.addControl('email',
            new FormControl(
              this.user_info.email,
              Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
                Validators.maxLength(50),
                Validators.minLength(6)
              ])
            )
          );
        }
      } else {

      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  openModal(item: any, action: any): void {
    this.btnOps.active = true;
    console.log(item);
    console.log(action);
    let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
      width: '400px',
      data: {
        item: item ? item : null,
        action: action
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
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
    });
    setTimeout(() => {
      this.btnOps.active = false;
    }, 1500);
  }
  changeRole(e): void {
    if (this.userForm.controls.role.value == 4 || this.userForm.controls.role.value == 5) {
      this.userForm.addControl('email',
        new FormControl(
          this.user_info.email ? this.user_info.email : '',
          Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
          ])
        )
      );
    } else {
      this.userForm.removeControl('email');
    }
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
  generatePassword(){
    this.btnOps_password.active = true;
    console.log(this.userForm.value);
    this.auth.generate(this.userForm.value).then(res=>{
      if(res['error']==0){
        this.userForm.controls.password.setValue(res['data']);
        /* console.log('res', res); */
      }
    }).catch(e=>{
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
