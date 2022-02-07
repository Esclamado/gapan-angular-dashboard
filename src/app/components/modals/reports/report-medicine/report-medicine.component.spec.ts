import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMedicineComponent } from './report-medicine.component';

describe('ReportMedicineComponent', () => {
  let component: ReportMedicineComponent;
  let fixture: ComponentFixture<ReportMedicineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportMedicineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
