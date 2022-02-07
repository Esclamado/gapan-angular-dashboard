import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFreshEggsComponent } from './report-fresh-eggs.component';

describe('ReportFreshEggsComponent', () => {
  let component: ReportFreshEggsComponent;
  let fixture: ComponentFixture<ReportFreshEggsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportFreshEggsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFreshEggsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
