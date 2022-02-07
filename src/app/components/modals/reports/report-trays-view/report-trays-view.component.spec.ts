import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTraysViewComponent } from './report-trays-view.component';

describe('ReportTraysViewComponent', () => {
  let component: ReportTraysViewComponent;
  let fixture: ComponentFixture<ReportTraysViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTraysViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTraysViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
