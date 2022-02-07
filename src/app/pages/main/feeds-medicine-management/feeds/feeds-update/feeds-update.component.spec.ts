import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsUpdateComponent } from './feeds-update.component';

describe('FeedsUpdateComponent', () => {
  let component: FeedsUpdateComponent;
  let fixture: ComponentFixture<FeedsUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
