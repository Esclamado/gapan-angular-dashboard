import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStocksComponent } from './report-stocks.component';

describe('ReportStocksComponent', () => {
  let component: ReportStocksComponent;
  let fixture: ComponentFixture<ReportStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
