import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsMedicineConsumptionCreateComponent } from './feeds-medicine-consumption-create.component';

describe('FeedsMedicineConsumptionCreateComponent', () => {
  let component: FeedsMedicineConsumptionCreateComponent;
  let fixture: ComponentFixture<FeedsMedicineConsumptionCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsMedicineConsumptionCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsMedicineConsumptionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
