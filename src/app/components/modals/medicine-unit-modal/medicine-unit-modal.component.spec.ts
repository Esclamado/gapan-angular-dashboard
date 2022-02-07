import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineUnitModalComponent } from './medicine-unit-modal.component';

describe('MedicineUnitModalComponent', () => {
  let component: MedicineUnitModalComponent;
  let fixture: ComponentFixture<MedicineUnitModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicineUnitModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineUnitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
