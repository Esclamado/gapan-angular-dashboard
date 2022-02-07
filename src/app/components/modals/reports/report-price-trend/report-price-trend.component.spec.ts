import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPriceTrendComponent } from './report-price-trend.component';

describe('ReportPriceTrendComponent', () => {
  let component: ReportPriceTrendComponent;
  let fixture: ComponentFixture<ReportPriceTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPriceTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPriceTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
