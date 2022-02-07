import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ConfirmPasswordModalComponent } from './../../../../components/modals/confirm-password-modal/confirm-password-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { staffroleoptions } from './../../../../components/datatables/filter/staff-role/staff-role';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { strrandom } from 'src/app/lib/strrandom/strrandom';
import { AuthService } from './../../../../services/auth/auth.service';
import { GeneralModalComponent } from './../../../../components/modals/general-modal/general-modal.component';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-staff-create',
  templateUrl: './staff-create.component.html',
  styleUrls: ['./staff-create.component.scss']
})
export class StaffCreateComponent implements OnInit {

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

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Add new staff',
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
      fontIcon: 'fa-plus',
      inline: true
    }
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
    private auth: AuthService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private location: Location,
    protected strand: strrandom
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
  }
  ngOnInit() {
    this.auth.validateUserRole();
  }
  openModal(item, action): void {
    this.btnOps.active = true;
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
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
            Validators.maxLength(50),
            Validators.minLength(6)
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
  chooseFile() {
    this.file_upload.nativeElement.click();
  }
}
