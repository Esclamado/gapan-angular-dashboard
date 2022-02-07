import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProductionPerHouseComponent } from './report-production-per-house.component';

describe('ReportProductionPerHouseComponent', () => {
  let component: ReportProductionPerHouseComponent;
  let fixture: ComponentFixture<ReportProductionPerHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportProductionPerHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportProductionPerHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
