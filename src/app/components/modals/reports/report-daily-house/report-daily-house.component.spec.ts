import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDailyHouseComponent } from './report-daily-house.component';

describe('ReportDailyHouseComponent', () => {
  let component: ReportDailyHouseComponent;
  let fixture: ComponentFixture<ReportDailyHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDailyHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDailyHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
