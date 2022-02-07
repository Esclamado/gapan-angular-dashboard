import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineCreateComponent } from './medicine-create.component';

describe('MedicineCreateComponent', () => {
  let component: MedicineCreateComponent;
  let fixture: ComponentFixture<MedicineCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicineCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
