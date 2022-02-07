import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProductionByEggSizeComponent } from './report-production-by-egg-size.component';

describe('ReportProductionByEggSizeComponent', () => {
  let component: ReportProductionByEggSizeComponent;
  let fixture: ComponentFixture<ReportProductionByEggSizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportProductionByEggSizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportProductionByEggSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
