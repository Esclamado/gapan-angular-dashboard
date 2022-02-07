import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSacksViewComponent } from './report-sacks-view.component';

describe('ReportSacksViewComponent', () => {
  let component: ReportSacksViewComponent;
  let fixture: ComponentFixture<ReportSacksViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSacksViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSacksViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
