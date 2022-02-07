import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEggModalComponent } from './add-egg-modal.component';

describe('AddEggModalComponent', () => {
  let component: AddEggModalComponent;
  let fixture: ComponentFixture<AddEggModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEggModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEggModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
