import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsMedicineManagementUpdateModalComponent } from './feeds-medicine-management-update-modal.component';

describe('FeedsMedicineManagementUpdateModalComponent', () => {
  let component: FeedsMedicineManagementUpdateModalComponent;
  let fixture: ComponentFixture<FeedsMedicineManagementUpdateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsMedicineManagementUpdateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsMedicineManagementUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
