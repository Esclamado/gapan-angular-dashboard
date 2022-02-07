import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTraysComponent } from './report-trays.component';

describe('ReportTraysComponent', () => {
  let component: ReportTraysComponent;
  let fixture: ComponentFixture<ReportTraysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTraysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTraysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
