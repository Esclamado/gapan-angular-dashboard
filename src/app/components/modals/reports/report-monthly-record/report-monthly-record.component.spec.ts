import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMonthlyRecordComponent } from './report-monthly-record.component';

describe('ReportMonthlyRecordComponent', () => {
  let component: ReportMonthlyRecordComponent;
  let fixture: ComponentFixture<ReportMonthlyRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportMonthlyRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMonthlyRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
