import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionByEggSizeComponent } from './production-by-egg-size.component';

describe('ProductionByEggSizeComponent', () => {
  let component: ProductionByEggSizeComponent;
  let fixture: ComponentFixture<ProductionByEggSizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionByEggSizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionByEggSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
