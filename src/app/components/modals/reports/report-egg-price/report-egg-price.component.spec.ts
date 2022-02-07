import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEggPriceComponent } from './report-egg-price.component';

describe('ReportEggPriceComponent', () => {
  let component: ReportEggPriceComponent;
  let fixture: ComponentFixture<ReportEggPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportEggPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportEggPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
