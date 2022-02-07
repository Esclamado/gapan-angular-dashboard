import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportsViewComponent } from './daily-reports-view.component';

describe('DailyReportsViewComponent', () => {
  let component: DailyReportsViewComponent;
  let fixture: ComponentFixture<DailyReportsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyReportsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyReportsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
