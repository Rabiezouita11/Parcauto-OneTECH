import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarburantAdminComponent } from './carburant-admin.component';

describe('CarburantAdminComponent', () => {
  let component: CarburantAdminComponent;
  let fixture: ComponentFixture<CarburantAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarburantAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarburantAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
