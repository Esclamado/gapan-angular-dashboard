import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HouseService } from './../../../services/house/house.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { EventsService } from 'angular4-events';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

export interface DialogData {
  item: any;
  action: any;
};

@Component({
  selector: 'app-house-modal',
  templateUrl: './house-modal.component.html',
  styleUrls: ['./house-modal.component.scss']
})
export class HouseModalComponent implements OnInit {

  public houseForm: FormGroup;

  item: any = null;
  action: any = 'create';

  modal_title: string = 'Add new house/building';
  modal_primary_button: string = 'Add House/Building';
  modal_message: string = 'Are you sure you want to remove this house/building?';
  modal_primary_button_class: string = 'btn-primary';

  isLoading: boolean = false;

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
    customClass: 'btn btn-sm btn-block btn-primary',
  };

  constructor(
    public dialogRef: MatDialogRef<HouseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private events: EventsService,
    private formBuilder: FormBuilder,
    private houseService: HouseService,
    private _snackBar: MatSnackBar
  ) {
    this.houseForm = this.formBuilder.group({
      id: [
        null
      ],
      house_name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
          /* Validators.pattern('^[0-9]+$') */
        ])
      ],
      capacity: [
        '',
        Validators.compose([
          Validators.min(1),
          Validators.required,
        ])
      ]
    });
  }

  ngOnInit() {
    console.log("data", this.data);
    this.item = this.data.item;
    this.action = this.data.action;
    console.log('candelete', this.item);
    if (this.item) {
      this.modal_title = 'Edit house/building details';
      this.modal_primary_button = 'Save Changes';
      if (this.item.beginning) {
        let min = Number(this.item.beginning.bird_count) + Number(this.item.beginning.cull) + Number(this.item.beginning.mortality);
        this.houseForm.controls.capacity.clearValidators();
        this.houseForm.controls.capacity.setValidators([
          Validators.required,
          Validators.min(min),
        ])
      }
      if (this.action && this.action == 'delete') {
        if (this.item && this.item.canDelete) {
          this.modal_primary_button = 'Yes, remove';
          this.modal_primary_button_class = 'btn-danger';
          this.modal_title = 'Remove house/building';
        } else {
          this.modal_primary_button = 'Okay';
          this.modal_primary_button_class = 'btn-primary';
          this.modal_title = 'Remove house/building';
          this.modal_message = 'You can not delete this house because it has an existing record.';
        }
        this.btnOps.customClass = 'btn btn-sm btn-block btn-danger';
      }
      this.houseForm.controls.id.setValue(this.item.id);
      this.houseForm.controls.house_name.setValue(this.item.house_name);
      this.houseForm.controls.capacity.setValue(this.item.capacity);
    }else{
      this.modal_primary_button = 'Save';
      this.modal_primary_button_class = 'btn-primary';
      this.modal_title = 'Add House/Building';
    }
    this.btnOps.text = this.modal_primary_button;
  }
  async submit() {
    this.btnOps.active = true;
    console.log(this.houseForm.value);
    this.isLoading = true;
    if (this.action == 'delete') {
      if(this.item && this.item.canDelete){
        this.modal_primary_button = 'Removing...';
        await this.houseService.remove(this.houseForm.value).then(res => {
          this.isLoading = false;
          if (res['error'] == 0) {
            this.events.publish('sidebar_house_refresh', true);
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
      }else{
        this.closeModal();
      }

    } else {
      this.modal_primary_button = this.action == 'create' ? 'Saving...' : 'Updating...';
      await this.houseService.save(this.houseForm.value).then(res => {
        this.isLoading = false;
        if (res['error'] == 0) {
          this.events.publish('sidebar_house_refresh', true);
          this.closeModal(res['message']);
        } else {
          this.modal_primary_button = this.action == 'create' ? 'Add House/Building' : 'Save Changes';
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
    setTimeout(() => {
      this.btnOps.active = false;
    }, 1500);
  }
  async closeModal(refresh?) {
    await this.dialogRef.close(refresh);
  }
}
