import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FeedsMedicineConsumptionService } from './../../../services/feeds-medicine-consumption/feeds-medicine-consumption.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface DialogData {
  item: any;
  action: any;
};

@Component({
  selector: 'app-feed-consumption-update-modal',
  templateUrl: './feed-consumption-update-modal.component.html',
  styleUrls: ['./feed-consumption-update-modal.component.scss']
})
export class FeedConsumptionUpdateModalComponent implements OnInit {

  public feedUpdateForm: FormGroup;

  item: any = null;
  action: any = 'update';

  modal_title: string = 'Update Feed Consumption';
  modal_primary_button: string = 'Save Changes';
  modal_message: string = 'Are you sure you want to update feed consumption?';
  modal_primary_button_class: string = 'btn-primary';

  isLoaded: boolean = false;

  feed_options: any = [];
  feed: any = {
    feed_id: null,
    feed_consumption: null
  };

  constructor(
    public dialogRef: MatDialogRef<FeedConsumptionUpdateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private feedsandmedicineConsumption: FeedsMedicineConsumptionService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) {
    this.feedUpdateForm = this.formBuilder.group({
      daily_house_report_id: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      feed:[]
    });
  }

  ngOnInit() {
    this.getAllFeeds();
    this.feedUpdateForm.controls.daily_house_report_id.setValue(this.data.item.id);
    this.feed = {
      feed_id: this.data.item.feed_id ? this.data.item.feed_id : null,
      feed_consumption: this.data.item.feed_consumption ? Number(this.data.item.feed_consumption) : 0
    }
  }
  async getAllFeeds() {
    await this.feedsandmedicineConsumption.getAllFeeds().then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        this.feed_options = res['datas'];
      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  chooseFeed(e) {
    this.feed.feed_id = e.value;
  }
  setFeedValue(e) {
    this.feed.feed_consumption = e;
  }
  async submit(){
    this.feedUpdateForm.controls.feed.setValue(this.feed);
    await this.feedsandmedicineConsumption.updateFeeds(this.feedUpdateForm.value).then(res => {
      this.isLoaded = false;
      if (res['error'] == 0) {
        this.closeModal(res['message']);
      } else {
/*         this.modal_primary_button = this.action == 'create' ? 'Add House/Building' : 'Save Changes';
        this._snackBar.open(res['message'], null, {
          verticalPosition: 'top',
          announcementMessage: res['message'],
          duration: 3000
        }); */
      }
    }).catch(e => {
      this.isLoaded = false;
      console.log("e", e);
      this._snackBar.open(e, null, {
        verticalPosition: 'top',
        announcementMessage: e,
        duration: 3000
      });
    });
  }
  async closeModal(refresh?) {
    await this.dialogRef.close(refresh);
  }
}
