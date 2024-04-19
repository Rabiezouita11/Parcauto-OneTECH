import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculeUpdateModalComponent } from './vehicule-update-modal.component';

describe('VehiculeUpdateModalComponent', () => {
  let component: VehiculeUpdateModalComponent;
  let fixture: ComponentFixture<VehiculeUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiculeUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiculeUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
