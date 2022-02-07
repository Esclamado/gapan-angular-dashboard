import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from './../../../../services/customer/customer.service';
import { GeneralModalComponent } from './../../../../components/modals/general-modal/general-modal.component';
import { TransactionCreateModalComponent } from './../../../../components/modals/transaction-create-modal/transaction-create-modal.component';
import { EggTypeService } from './../../../../services/egg-type/egg-type.service';
import { datatable } from './../../../../components/datatables/transaction-create/transaction-create';
import { modeofpayment } from './../../../../components/datatables/filter/mode-of-payment/mode-of-payment';
import { Router } from '@angular/router';

import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-transactions-create',
  templateUrl: './transactions-create.component.html',
  styleUrls: ['./transactions-create.component.scss']
})
export class TransactionsCreateComponent implements OnInit {

  public orderForm: FormGroup;
  customer_options: any = [];
  ths: any = datatable;
  
  egg_type_options: any = [];
  mode_of_payment_options: any = modeofpayment;
  mode_of_payment_label: any = '';
  total_pieces: any = 0;
  cart: any = [{
    id: null,
    label: null,
    price: 0,
    total_qty: 0,
    total_price: 0,
    items: [
      {
        type_id: 1,
        type: 'Case',
        qty: 0
      },
      {
        type_id: 2,
        type: 'Tray',
        qty: 0
      },
      {
        type_id: 3,
        type: 'Piece',
        qty: 0
      }
    ]
  }];
  canProceed: boolean = false;
  my_order: any = [];
  order: any = {
    order_by_column: 'id',
    order_by: 'asc'
  };
  btnOps: MatProgressButtonOptions = {
    active: false,
    text: 'Next Step',
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
    private customerService: CustomerService,
    private eggTypeService: EggTypeService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private location: Location,
    private router: Router
  ) {
    this.orderForm = this.formBuilder.group({
      user_id: [
        null
      ],
      customer_name: [
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
          Validators.maxLength(250)
        ])
      ],
      /* mode_of_payment: [
        '',
        Validators.compose([
          Validators.required
        ])
      ], */
      request: [
        '',
        Validators.compose([
          Validators.maxLength(250)
        ])
      ],
      payment: [
        null
      ],
      cart: [
        null
      ]
    });
  }

  ngOnInit() {
    console.log("init this");
    let my_order = JSON.parse(localStorage.getItem("my_order"));
    if (my_order) {
      console.log(my_order);
      this.orderForm.controls.user_id.setValue(my_order.customer.user_id);
      this.orderForm.controls.customer_name.setValue(my_order.customer.customer_name);
      this.orderForm.controls.number.setValue(my_order.customer.number);
      this.orderForm.controls.location.setValue(my_order.customer.location);
      this.orderForm.controls.request.setValue(my_order.customer.request);

      this.cart = [];
      my_order.cart.forEach((data, index) => {
        this.cart.push(data);
      });
      this.validateProceed();
    }
    this.getEggTypeList();
  }
  async getEggTypeList() {
    await this.eggTypeService.getList().then(res => {
      if (res['error'] == 0) {
        res['datas'].forEach(data => {
          if (data.id < 10 || data.id > 13) {
            data.isUsed = false;
            this.egg_type_options.push(data);
          }
          console.log('getEggs', res['datas']['stock']);
        })
        /* this.egg_type_options = res['datas']; */
        console.log('this.egg_type_options',this.egg_type_options);
      }
    }).catch(e => {
      console.log(e);
    });
  }
  async getCustomerList() {
    this.orderForm.controls.user_id.setValue(null);
    await this.customerService.getList(1, 10, null, this.orderForm.controls.customer_name.value).then(res => {
      if (res['error'] == 0) {
        this.customer_options = res['datas'];
      } else {
        this.customer_options = [];
      }
    }).catch(e => {
      console.log(e);
    });
  }
  customerSelected(e: any) {
    let get_customer_name = this.customer_options.find(a => a.id == this.orderForm.controls.customer_name.value);
    if (get_customer_name) {
      this.orderForm.controls.user_id.setValue(get_customer_name.id);
      this.orderForm.controls.customer_name.setValue(get_customer_name.profile_first_name + ' ' + get_customer_name.profile_last_name);
      this.orderForm.controls.number.setValue(get_customer_name.contact_number);
      this.orderForm.controls.location.setValue(get_customer_name.address_address);
    }
  }
  eggTypeSelected(e, i) {
    console.log("eggTypeSelected", e.value);

    let egg = this.egg_type_options.find(a => a.id == e.value);
    console.log('egg', egg);
    
    let isExist = this.cart.find(a => a.id == e.value);
    if (isExist) {
      this._snackBar.open('Egg type already exists in your basket', 'Okay', {
        verticalPosition: 'top',
        announcementMessage: 'Egg type already exists in your basket',
        duration: 3000
      });
      this.cart[i] = {
        id: null,
        label: null,
        price: 0,
        total_qty: 0,
        total_price: 0,
        stock: egg.stock,
        items: [
          {
            type_id: 1,
            type: 'Case',
            qty: null
          },
          {
            type_id: 2,
            type: 'Tray',
            qty: null
          },
          {
            type_id: 3,
            type: 'Piece',
            qty: null
          }
        ]
      };
    } else {
      this.cart[i] = {
        id: e.value,
        label: egg.type,
        price: egg.price.price,
        total_qty: 0,
        total_price: 0,
        stock: egg.stock,
        items: [
          {
            type_id: 1,
            type: 'Case',
            qty: null
          },
          {
            type_id: 2,
            type: 'Tray',
            qty: null
          },
          {
            type_id: 3,
            type: 'Piece',
            qty: null
          }
        ]
      };
    }
    console.log("cart", this.cart);
    this.validateProceed();
  }
  addItemToCart() {
    this.cart.push(
      {
        id: null,
        label: null,
        price: 0,
        total_qty: 0,
        total_price: 0,
        items: [
          {
            type_id: 1,
            qty: 0
          },
          {
            type_id: 2,
            qty: 0
          },
          {
            type_id: 3,
            qty: 0
          }
        ]
      }
    )
    this.validateProceed();
  }
  changeQty(e, i, t) {
    this.cart[i]['items'][t]['qty'] = e.target.value;
    console.log("cart", this.cart);
    
    let total_price: number = 0;
    let total_qty: number = 0;

    this.cart[i]['items'].forEach(item => {
      if (item.type_id == 1) {
        total_qty += Number(item.qty) * 360;
      } else if (item.type_id == 2) {
        total_qty += Number(item.qty) * 30;
      } else if (item.type_id == 3) {
        total_qty += Number(item.qty);
      }
    });
    total_price = Number(total_qty) * Number(this.cart[i]['price']);
    this.cart[i]['total_qty'] = total_qty;
    this.cart[i]['total_price'] = total_price;
    this.validateProceed();
  }
  async submit() {
    this.btnOps.active = true;
    let cartToRetain = this.cart.filter(e => e.total_qty > 0);
    this.cart = [];
    let total_price = 0;
    await cartToRetain.forEach(data => {
      total_price += Number(data.total_price);
      console.log('tete', data.total_price);
      this.cart.push(data);
      console.log('tete1', this.cart.push(data));
    });
    this.orderForm.controls.cart.setValue(this.cart);
    let dialog = this.dialog.open(TransactionCreateModalComponent, {
      width: '400px',
      data: {
        item: this.orderForm.value,
        total_price: total_price
      }
    });
    dialog.afterClosed().subscribe((result: any) => {
      console.log("result", result);
      if (result) {
        localStorage.setItem("my_order", JSON.stringify(result));
        this.router.navigate(["transactions/create/preview"]);
      }
    });
    setTimeout(() => {
      this.btnOps.active = false;
    }, 1500);
  }
  goBack(action?, page?) {
    let dialog = this.dialog.open(GeneralModalComponent, {
      width: '400px',
      data: {
        item: null,
        action: action,
        page: page
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.location.back();
      }
    });
  }
  async removeItemInCart(i) {
    this.cart.splice(i, 1);
    this.validateProceed();
    if (this.cart.length == 0) {
      this.addItemToCart();
    }
  }
  async validateProceed() {
    let canProceed = false;
    let grand_total_pcs = 0;
    await this.cart.forEach(cart => {
      grand_total_pcs += Number(cart.total_qty);
      canProceed = cart.total_qty > 0 ? true : false;
    });
    this.canProceed = canProceed && grand_total_pcs >= 30 ? true : false;
  }
  async orderList(can_sort, order_by_column, order_by) {
    if (can_sort) {
      this.order = {
        order_by_column: order_by_column,
        order_by: order_by
      };
    }
  }
}
