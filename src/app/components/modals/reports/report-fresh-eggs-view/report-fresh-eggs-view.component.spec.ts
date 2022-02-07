import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFreshEggsViewComponent } from './report-fresh-eggs-view.component';

describe('ReportFreshEggsViewComponent', () => {
  let component: ReportFreshEggsViewComponent;
  let fixture: ComponentFixture<ReportFreshEggsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportFreshEggsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFreshEggsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
