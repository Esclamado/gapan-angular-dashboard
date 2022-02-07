import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshEggInventoryModalComponent } from './fresh-egg-inventory-modal.component';

describe('FreshEggInventoryModalComponent', () => {
  let component: FreshEggInventoryModalComponent;
  let fixture: ComponentFixture<FreshEggInventoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreshEggInventoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshEggInventoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
