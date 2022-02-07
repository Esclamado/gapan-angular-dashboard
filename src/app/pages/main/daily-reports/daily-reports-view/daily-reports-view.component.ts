import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { StaffService } from './../../../../services/staff/staff.service';
import { DailyReportsService } from './../../../../services/daily-reports/daily-reports.service';
import { MatDialog } from '@angular/material/dialog';
import { ExportToCsv } from 'export-to-csv';
import { ReportDailyViewComponent } from './../../../../components/modals/reports/report-daily-view/report-daily-view.component';
import { AuthService } from './../../../../services/auth/auth.service';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-daily-reports-view',
  templateUrl: './daily-reports-view.component.html',
  styleUrls: ['./daily-reports-view.component.scss']
})
export class DailyReportsViewComponent implements OnInit {

  item: any = [];
  
  sorting_item: any = [];

  /* timeline = [
    {statuslabel: "Order Placed", status: 2, created_at: "2019-12-04 14:30:06"},
    {statuslabel: "Order Approved", status: 1, created_at: "2019-12-06 14:14:50"},
    {statuslabel: "Order has been processed", status: 0, created_at: null},
    {statuslabel: "Ready For Pick Up", status: 0, created_at: null},
    {statuslabel: "Order Released", status: 0, created_at: null}
  ] */
  isLoaded: boolean = false;
  selectedIndex: number = 0;
  printabledata: any = [];

  btnOps_pdf: MatProgressButtonOptions = {
    active: false,
    text: 'Download as PDF',
    spinnerSize: 19,
    raised: false,
    stroked: false,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    customClass: 'btn btn-primary btn-block mb-12',
    buttonIcon: {
      fontSet: 'fa',
      fontIcon: 'fa-download',
      inline: true
    }
  };

  btnOps_csv: MatProgressButtonOptions = {
    active: false,
    text: 'Download as CSV',
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
    private auth: AuthService,
    private dailyReportsService: DailyReportsService,
    private location: Location,
    public _route: ActivatedRoute,
    private staffService: StaffService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.auth.validateUserRole();
    this._route.params.subscribe(params => {
      this.getRecord(params['id']);
      this.getSortingRecord(params['id']);
    });
  }
  async getRecord(dailyhouse_id) {
    await this.staffService.getRecord(dailyhouse_id).then(res => {
      console.log("getRecord", res);
      this.isLoaded = true;
      if (res['error'] == 0) {
        this.item = res['data'];
      }
    }).catch(e => {
      console.log("e", e);
      this.isLoaded = true;
    });
  }
  async getSortingRecord(house_harvest_id) {
    await this.dailyReportsService.getSortingRecord(house_harvest_id).then(res => {
      if (res['error'] == 0) {
        this.sorting_item = res['data'];
      }
    }).catch(e => {
      console.log("e", e);
    });
  }
  goBack() {
    this.location.back();
  }
  openModal() {
    this.btnOps_pdf.active = true;
    let dialog = this.dialog.open(ReportDailyViewComponent, {
      /* width: '400px', */
      panelClass: "scroll",
      data: {
        daily_report: this.item,
        sorting_report: this.sorting_item
      }
    });
    dialog.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.btnOps_pdf.active = false;
      }, 1500);
    });
  }
  async exportToCsv() {
    this.btnOps_csv.active = true;
    let datas = [];
    let meds = [];
    this.item.medicine.forEach(med => {
      meds.push(med.medicine);
    });

    this.printabledata = {
      'Harvested By': this.item.name,
      'House/Building no.': this.item.house.house_name,
      'Report Date': this.datePipe.transform(new Date(this.sorting_item.prepared_by_date), 'yyyy-MM-dd'),
      'Report Time': this.datePipe.transform(new Date(this.sorting_item.prepared_by_date), 'hh:mm aaa'),
      'Bird Count': this.item.bird_count,
      'Age': this.item.age,
      'Mortality': this.item.mortality,
      'Cull': this.item.cull,
      'End Bird Population': this.item.bird_count,
      'No. of Sacks': this.item.feeds.bags,
      'Feed Consumption': this.item.feeds.string,
      'Medicine Intake': meds.join(','),
      'Egg Count': this.item.egg_count,
      'Validated Egg Count': this.item.real_egg_count,
      'Prepared By': this.item.name,
      'Checked By': this.item.checked_by_name,
      'Received by': this.item.received_by_name,
      'Sorted By': this.sorting_item ? this.sorting_item.prepared_by_name : '',
      'Sorted Date': this.sorting_item ? this.datePipe.transform(new Date(this.sorting_item.prepared_by_date), 'yyyy-MM-dd') : '',
      'Sorted Time': this.sorting_item ? this.datePipe.transform(new Date(this.sorting_item.prepared_by_date), 'hh:mm aaa') : '',
      'Sorted Checked By': this.sorting_item ? this.sorting_item.checked_by_name : '',
      'Sorted Received By': this.sorting_item ? this.sorting_item.received_by_name : ''
    };
    datas.push(this.printabledata);
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title:  'Daily-Report-View-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename: 'Daily-Report-View-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(datas);
    setTimeout(() => {
      this.btnOps_csv.active = false;
    }, 1500);
  }
  async tabChanged(e) {
    console.log(this.selectedIndex);
  }
}
