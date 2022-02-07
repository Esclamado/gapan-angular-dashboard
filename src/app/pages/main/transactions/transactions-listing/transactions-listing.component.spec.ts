import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsListingComponent } from './transactions-listing.component';

describe('TransactionsListingComponent', () => {
  let component: TransactionsListingComponent;
  let fixture: ComponentFixture<TransactionsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
