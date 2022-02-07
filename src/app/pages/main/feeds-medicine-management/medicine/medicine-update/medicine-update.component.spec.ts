import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineUpdateComponent } from './medicine-update.component';

describe('MedicineUpdateComponent', () => {
  let component: MedicineUpdateComponent;
  let fixture: ComponentFixture<MedicineUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicineUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
