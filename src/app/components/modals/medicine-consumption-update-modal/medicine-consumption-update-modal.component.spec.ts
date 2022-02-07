import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineConsumptionUpdateModalComponent } from './medicine-consumption-update-modal.component';

describe('MedicineConsumptionUpdateModalComponent', () => {
  let component: MedicineConsumptionUpdateModalComponent;
  let fixture: ComponentFixture<MedicineConsumptionUpdateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicineConsumptionUpdateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineConsumptionUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
