import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOverallSalesComponent } from './report-overall-sales.component';

describe('ReportOverallSalesComponent', () => {
  let component: ReportOverallSalesComponent;
  let fixture: ComponentFixture<ReportOverallSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportOverallSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOverallSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
