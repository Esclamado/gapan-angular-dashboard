import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FeedsMedicineManagementService } from './../../../services/feeds-medicine-management/feeds-medicine-management.service';

import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  item: any;
  action: any;
};

@Component({
  selector: 'app-medicine-unit-modal',
  templateUrl: './medicine-unit-modal.component.html',
  styleUrls: ['./medicine-unit-modal.component.scss']
})
export class MedicineUnitModalComponent implements OnInit {

  public medicineUnitForm: FormGroup;

  item: any = [];
  action: any = 'create';

  modal_title: string = 'Add new medicine unit';
  modal_primary_button: string = 'Add Medicine Unit';
  modal_message: string = 'Are you sure you want to remove this medicine unit?';

  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<MedicineUnitModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private feedsMedicineManagementService: FeedsMedicineManagementService,
    private _snackBar: MatSnackBar
  ) {
    this.medicineUnitForm = this.formBuilder.group({
      id: [
        null
      ],
      unit: [
        '',
        Validators.compose([
          Validators.required
        ])
      ]
    });
  }

  ngOnInit() {
    console.log("data", this.data);
    this.item = this.data.item;
    this.action = this.data.action;
    if (this.item) {
      this.modal_title = 'Edit medicine unit details';
      this.modal_primary_button = 'Save Changes';
      if (this.action && this.action == 'delete') {
        this.modal_primary_button = 'Yes, remove';
        this.modal_title = 'Remove medicine unit';
      }
      this.medicineUnitForm.controls.id.setValue(this.item.id);
      this.medicineUnitForm.controls.unit.setValue(this.item.unit);
    }
  }
  async submit() {
    this.isLoading = true;
    if (this.action == 'delete') {
      this.modal_primary_button = 'Removing...';
      await this.feedsMedicineManagementService.removeMedicineUnit(this.medicineUnitForm.value).then(res => {
        this.isLoading = false;
        if (res['error'] == 0) {
          this.closeModal(res['message']);
        } else {
          this.modal_primary_button = 'Yes, remove';
          this._snackBar.open(res['message'], null, {
            verticalPosition: 'top',
            announcementMessage: res['message'],
            duration: 3000
          });
        }
      }).catch(e => {
        this.isLoading = false;
        console.log("e", e);
        this._snackBar.open(e, null, {
          verticalPosition: 'top',
          announcementMessage: e,
          duration: 3000
        });
      });
    } else {
      this.modal_primary_button = this.action == 'create' ? 'Saving...' : 'Updating...';
      await this.feedsMedicineManagementService.saveMedicineUnit(this.medicineUnitForm.value).then(res => {
        this.isLoading = false;
        if (res['error'] == 0) {
          this.closeModal(res);
        } else {
          this.modal_primary_button = this.action == 'create' ? 'Add Medicine Unit' : 'Save Changes';
          this._snackBar.open(res['message'], null, {
            verticalPosition: 'top',
            announcementMessage: res['message'],
            duration: 3000
          });
        }
      }).catch(e => {
        this.isLoading = false;
        console.log("e", e);
        this._snackBar.open(e, null, {
          verticalPosition: 'top',
          announcementMessage: e,
          duration: 3000
        });
      });
    }
  }
  async closeModal(refresh?) {
    await this.dialogRef.close(refresh);
  }

}
