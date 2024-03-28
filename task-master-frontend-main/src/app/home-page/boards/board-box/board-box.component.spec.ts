import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardBoxComponent } from './board-box.component';

describe('BoardBoxComponent', () => {
  let component: BoardBoxComponent;
  let fixture: ComponentFixture<BoardBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
