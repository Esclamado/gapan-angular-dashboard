import { Component, OnInit } from '@angular/core';
import { InventoryStocksService } from './../../../services/inventory-stocks/inventory-stocks.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-fresh-egg-inventory-modal',
  templateUrl: './fresh-egg-inventory-modal.component.html',
  styleUrls: ['./fresh-egg-inventory-modal.component.scss']
})
export class FreshEggInventoryModalComponent implements OnInit {

  items: any = [];

  modal_title: string = 'Current Stocks';
  modal_primary_button: string = 'Okay';
  modal_primary_button_class: string = 'btn-primary';
  modal_message: string = 'Latest inventory of fresh eggs';
  isLoaded: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FreshEggInventoryModalComponent>,
    private inventoryStocksService: InventoryStocksService
  ) { }

  ngOnInit() {
    this.getList();
  }
  async getList() {
    await this.inventoryStocksService.search().then(res => {
      this.isLoaded = true;
      if (res['error'] == 0) {
        this.items = res['data'];
      }
    }).catch(e => {
      this.isLoaded = true;
      console.log(e);
    });
  }
  async closeModal(refresh?) {
    await this.dialogRef.close(refresh);
  }
}
