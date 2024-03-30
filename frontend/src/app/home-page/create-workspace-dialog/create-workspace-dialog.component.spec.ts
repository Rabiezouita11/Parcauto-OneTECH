import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkspaceDialogComponent } from './create-workspace-dialog.component';

describe('CreateWorkspaceDialogComponent', () => {
  let component: CreateWorkspaceDialogComponent;
  let fixture: ComponentFixture<CreateWorkspaceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWorkspaceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkspaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
