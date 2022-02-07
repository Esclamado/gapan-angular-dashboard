import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsListingByPaymentStatusComponent } from './transactions-listing-by-payment-status.component';

describe('TransactionsListingByPaymentStatusComponent', () => {
  let component: TransactionsListingByPaymentStatusComponent;
  let fixture: ComponentFixture<TransactionsListingByPaymentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsListingByPaymentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsListingByPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
