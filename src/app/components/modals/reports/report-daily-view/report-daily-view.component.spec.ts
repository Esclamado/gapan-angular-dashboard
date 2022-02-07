import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDailyViewComponent } from './report-daily-view.component';

describe('ReportDailyViewComponent', () => {
  let component: ReportDailyViewComponent;
  let fixture: ComponentFixture<ReportDailyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDailyViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDailyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
