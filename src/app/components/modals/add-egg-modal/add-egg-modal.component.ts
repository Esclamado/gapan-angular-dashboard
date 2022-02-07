import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EventsService } from 'angular4-events';

import { EggTypeService } from './../../../services/egg-type/egg-type.service';
import { ConfirmPasswordModalComponent } from './../confirm-password-modal/confirm-password-modal.component';

export interface DialogData {
  item: any;
  action: any;
};

@Component({
  selector: 'app-add-egg-modal',
  templateUrl: './add-egg-modal.component.html',
  styleUrls: ['./add-egg-modal.component.scss']
})
export class AddEggModalComponent implements OnInit {

  public eggForm: FormGroup;

  item: any = [];
  action: any = 'create';

  modal_title: string = 'Create New Egg Size';
  modal_primary_button: string = 'Save';
  modal_message: string = '';

  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddEggModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private events: EventsService,
    private formBuilder: FormBuilder,
    private eggTypeService: EggTypeService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.eggForm = this.formBuilder.group({
      type: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      type_shortcode: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      price: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(0.00)
        ])
      ]
    });
  }

  ngOnInit() {
  }
  async submit() {
    let dialog = this.dialog.open(ConfirmPasswordModalComponent, {
      width: '400px',
      data: {
        item: this.eggForm.value,
        action: this.action == 'create' ? 'egg_create' : 'egg_update'
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
    this.closeModal();
  }
  async closeModal(refresh?) {
    await this.dialogRef.close(refresh);
  }
}
