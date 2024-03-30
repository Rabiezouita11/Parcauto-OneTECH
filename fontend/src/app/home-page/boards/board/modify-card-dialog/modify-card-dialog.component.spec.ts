import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCardDialogComponent } from './modify-card-dialog.component';

describe('ModifyCardDialogComponent', () => {
  let component: ModifyCardDialogComponent;
  let fixture: ComponentFixture<ModifyCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyCardDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
