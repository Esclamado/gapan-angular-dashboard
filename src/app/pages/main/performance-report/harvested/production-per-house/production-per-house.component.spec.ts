import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPerHouseComponent } from './production-per-house.component';

describe('ProductionPerHouseComponent', () => {
  let component: ProductionPerHouseComponent;
  let fixture: ComponentFixture<ProductionPerHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionPerHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPerHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
