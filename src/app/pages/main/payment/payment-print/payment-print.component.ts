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

import { datatable } from './../../../../components/datatables/payment/payment-form-print/payment-form-print';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { DatePipe } from '@angular/common';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-payment-print',
  templateUrl: './payment-print.component.html',
  styleUrls: ['./payment-print.component.scss']
})
export class PaymentPrintComponent implements OnInit {

  item: any = [];
  order_id: number;
  fromPage: any;
  order_items: any = [];
  isLoaded: boolean = false;

  date_today: any = new Date();

  ths: any = datatable;
  visible_columns: any = [];

  user_profile: any = [];

  order: any = {
    order_by_column: 'id',
    order_by: 'asc'
  };

  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementId: 'printable-section',
    options: {
      jsPDF: {
        orientation: 'portrait',
        format: 'letter',
      },
      margin: 10,
      compress: true,
      pagebreak: {
        after: '.break-now'
      },
      image: {
        type: 'jpeg',
        quality: 0.95
      },
      html2canvas:  {
        scale: 2
      }
    }
  };

  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Download Forms',
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
      fontIcon: 'fa-download',
      inline: true
    }
  };

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
    private exportAsService: ExportAsService,
    private datePipe: DatePipe
  ) {
    this.ths.forEach((data, index) => {
      this.visible_columns.push(index);
    });
  }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem("user"));
    this.user_profile = user;
    this._route.params.subscribe(params => {
      console.log(params);
      this.order_id = params['id'];
      this.fromPage = params['from'];
      this.getRecord();
    });
  }
  async getRecord() {
    await this.transactionsService.getRecord(this.order_id).then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        res['data']['sub_total_price'] = Number(res['data']['total_price']) + Number(res['data']['discount']);
        this.item = res['data'];
        console.log("this item", this.item);
        res['data']['order_items'].forEach((data, index) => {
          let d = [
            {},
            {},
            {}
          ];
          let price = 0;
          console.log("data", data);
          data.order_item_details.forEach(data => {
            if (data.type_id == 1) {
              d[0] = data;
              price = data.price;
            }
            if (data.type_id == 2) {
              d[1] = data;
              price = data.price;
            }
            if (data.type_id == 3) {
              d[2] = data;
              price = data.price;
            }
          });
          data.price = price;
          data.order_item_details = d;
          this.order_items.push(data);
        });
        console.log("order_items", this.order_items);
        /* this.order_items = res['data']['order_items']; */
      }
    }).catch(e => {
      this.isLoaded = true;
      console.log("e", e);
    });
  }
  goBack() {
    if (this.fromPage == 'payment') {
      this.route.navigate(['/transactions/view', this.order_id]);
    } else {
      this.location.back();
    }
  }
  async exportPdf(type: SupportedExtensions, opt?: string) {
    this.btnOps.active = true;
    this.exportAsConfig.type = type;
    if (opt) {
      this.exportAsConfig.options.jsPDF.orientation = opt;
    }
    let fileName = 'Customer-Transaction-Form-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
      setTimeout(() => {
        this.btnOps.active = false;
      }, 1500);
    });
  }
  async orderList(can_sort, order_by_column, order_by) {
    if (can_sort) {
      this.order = {
        order_by_column: order_by_column,
        order_by: order_by
      };
    }
  }
  counter(i: number) {
    return new Array(i);
  }
}