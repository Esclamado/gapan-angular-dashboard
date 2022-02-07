import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaymentModalComponent } from './view-payment-modal.component';

describe('ViewPaymentModalComponent', () => {
  let component: ViewPaymentModalComponent;
  let fixture: ComponentFixture<ViewPaymentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPaymentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
