import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarburantConducteurComponent } from './carburant-conducteur.component';

describe('CarburantConducteurComponent', () => {
  let component: CarburantConducteurComponent;
  let fixture: ComponentFixture<CarburantConducteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarburantConducteurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarburantConducteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
