import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByEggSizeComponent } from './sales-by-egg-size.component';

describe('SalesByEggSizeComponent', () => {
  let component: SalesByEggSizeComponent;
  let fixture: ComponentFixture<SalesByEggSizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesByEggSizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesByEggSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
