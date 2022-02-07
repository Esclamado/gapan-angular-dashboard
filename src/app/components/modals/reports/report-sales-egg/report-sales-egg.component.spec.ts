import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSalesEggComponent } from './report-sales-egg.component';

describe('ReportSalesEggComponent', () => {
  let component: ReportSalesEggComponent;
  let fixture: ComponentFixture<ReportSalesEggComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSalesEggComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSalesEggComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
