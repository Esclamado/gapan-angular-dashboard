import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffMyProfileComponent } from './staff-my-profile.component';

describe('StaffMyProfileComponent', () => {
  let component: StaffMyProfileComponent;
  let fixture: ComponentFixture<StaffMyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffMyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
