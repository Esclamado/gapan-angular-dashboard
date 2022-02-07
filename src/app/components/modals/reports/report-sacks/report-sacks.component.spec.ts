import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSacksComponent } from './report-sacks.component';

describe('ReportSacksComponent', () => {
  let component: ReportSacksComponent;
  let fixture: ComponentFixture<ReportSacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
