import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFeedsConsumptionComponent } from './report-feeds-consumption.component';

describe('ReportFeedsConsumptionComponent', () => {
  let component: ReportFeedsConsumptionComponent;
  let fixture: ComponentFixture<ReportFeedsConsumptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportFeedsConsumptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFeedsConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
