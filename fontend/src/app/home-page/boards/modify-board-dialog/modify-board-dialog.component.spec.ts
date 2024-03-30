import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyBoardDialogComponent } from './modify-board-dialog.component';

describe('ModifyBoardDialogComponent', () => {
  let component: ModifyBoardDialogComponent;
  let fixture: ComponentFixture<ModifyBoardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyBoardDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyBoardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
