import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsCreateComponent } from './feeds-create.component';

describe('FeedsCreateComponent', () => {
  let component: FeedsCreateComponent;
  let fixture: ComponentFixture<FeedsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
