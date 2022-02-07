import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedsMedicineManagementService } from './../../../services/feeds-medicine-management/feeds-medicine-management.service';
import { EventsService } from 'angular4-events';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

export interface DialogData {
  item: any;
  action: any;
  type: any;
};

@Component({
  selector: 'app-feeds-medicine-management-update-modal',
  templateUrl: './feeds-medicine-management-update-modal.component.html',
  styleUrls: ['./feeds-medicine-management-update-modal.component.scss']
})
export class FeedsMedicineManagementUpdateModalComponent implements OnInit {

  public feedsmedsForm: FormGroup;

  item: any = null;
  action: any = 'create';
  type: any = null;

  modal_title: string = 'Update No. of orders';

  isLoading: boolean = false;

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
    customClass: 'btn btn-primary btn-block',
  };

  constructor(
    public dialogRef: MatDialogRef<FeedsMedicineManagementUpdateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    /* private events: EventsService, */
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private feedsmedicinemanagementService: FeedsMedicineManagementService,
    private events: EventsService
  ) { 
    this.feedsmedsForm = this.formBuilder.group({
      id: [
        null
      ],
      quantity: [
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
    this.type = this.data.type;
  }

  async submit(){
    this.btnOps.active = true;
    let jsonData = {
      id: this.item.id,
      pieces: parseFloat(this.feedsmedsForm.value.quantity) ? parseFloat(this.feedsmedsForm.value.quantity) + parseFloat(this.item.pieces) : parseFloat(this.item.pieces),
      type: this.type
    }
    await this.feedsmedicinemanagementService.updateFeedsMedsManagement(jsonData).then((res: any) => {
      this.isLoading = false;
      if (res.error == 0) {
        this.closeModal(res.message);
      } else {
        this._snackBar.open(res.message, null, {
          verticalPosition: 'top',
          announcementMessage: res.message,
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
    setTimeout(() => {
      this.btnOps.active = false;
    }, 1500);
  }
  async closeModal(refresh?) {
    await this.dialogRef.close(refresh);
  }

}
