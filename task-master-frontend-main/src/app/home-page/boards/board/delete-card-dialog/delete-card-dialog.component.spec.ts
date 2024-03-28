import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCardDialogComponent } from './delete-card-dialog.component';

describe('DeleteCardDialogComponent', () => {
  let component: DeleteCardDialogComponent;
  let fixture: ComponentFixture<DeleteCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCardDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
