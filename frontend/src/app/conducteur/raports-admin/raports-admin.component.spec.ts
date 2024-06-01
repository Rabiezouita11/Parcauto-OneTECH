import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaportsAdminComponent } from './raports-admin.component';

describe('RaportsAdminComponent', () => {
  let component: RaportsAdminComponent;
  let fixture: ComponentFixture<RaportsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaportsAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaportsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
