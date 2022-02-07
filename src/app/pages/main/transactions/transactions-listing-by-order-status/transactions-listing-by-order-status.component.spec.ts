import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsListingByOrderStatusComponent } from './transactions-listing-by-order-status.component';

describe('TransactionsListingByOrderStatusComponent', () => {
  let component: TransactionsListingByOrderStatusComponent;
  let fixture: ComponentFixture<TransactionsListingByOrderStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsListingByOrderStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsListingByOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
